import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { WebSocketManager } from './websocket.js';
import { ActivityStore } from './activity-store.js';
import { getHotFolders, clearCache as clearGitCache } from './git-activity.js';
import {
  FileActivityEvent,
  ThinkingEvent,
  AgentThinkingState,
  AgentRole,
  ToolCategory,
  SystemSummary,
  categorizeToolool
} from './types.js';

const PORT = 5174; // Fixed port - never change

// PROJECT_ROOT: Use env var, command line arg, or detect from cwd
function detectProjectRoot(): string {
  if (process.env.PROJECT_ROOT) return process.env.PROJECT_ROOT;
  if (process.argv[2]) return process.argv[2];

  const cwd = process.cwd();
  // If we're in a 'server' subdirectory of a workspace, go up one level
  if (cwd.endsWith('/server') || cwd.endsWith('\\server')) {
    return path.dirname(cwd);
  }
  return cwd;
}

const PROJECT_ROOT = detectProjectRoot();

// Convert absolute file paths to relative (for client matching)
function toRelativePath(absolutePath: string): string {
  if (absolutePath === PROJECT_ROOT) {
    return '.';
  }
  const prefix = PROJECT_ROOT + '/';
  if (absolutePath.startsWith(prefix)) {
    return absolutePath.slice(prefix.length) || '.';
  }
  return absolutePath;
}

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wsManager = new WebSocketManager(server);
const activityStore = new ActivityStore(PROJECT_ROOT);

// Broadcast graph updates when files are created/deleted
activityStore.onGraphChange((graphData) => {
  wsManager.broadcast('graph', graphData);
});

// Track thinking state per agent
const agentStates = new Map<string, AgentThinkingState>();
const AGENT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const MAX_AGENTS = 10; // HARD LIMIT - never allow more than this
const AGENT_CREATION_COOLDOWN_MS = 500; // Minimum time between new agent registrations
let lastAgentCreationTime = 0;

// Permission prompt detection threshold
const WAITING_FOR_INPUT_THRESHOLD_MS = 60000;

// Debug/observability tracking
const SERVER_START_TIME = Date.now();
const recentActivityBuffer: Array<{
  type: string;
  filePath: string;
  agentId?: string;
  timestamp: number;
  skillName?: string;
  mcpServer?: string;
}> = [];
const MAX_ACTIVITY_BUFFER = 50;

// Agent state persistence
const STATE_FILE = path.join(PROJECT_ROOT, '.codemap-state.json');

// Track active skills and MCP servers system-wide
const activeSkills = new Set<string>();
const activeMcpServers = new Set<string>();

function saveAgentState(): void {
  try {
    const state = {
      savedAt: Date.now(),
      agents: Array.from(agentStates.values()),
      activeSkills: Array.from(activeSkills),
      activeMcpServers: Array.from(activeMcpServers),
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error('Failed to save agent state:', err);
  }
}

function loadAgentState(): void {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      const now = Date.now();

      // Only restore agents that haven't timed out
      for (const agent of data.agents || []) {
        if (now - agent.lastActivity < AGENT_TIMEOUT_MS) {
          // Ensure new fields have defaults
          agent.agentRole = agent.agentRole || 'main';
          agent.operationCount = agent.operationCount || 0;
          agent.fileReads = agent.fileReads || 0;
          agent.fileWrites = agent.fileWrites || 0;
          agent.skillInvocations = agent.skillInvocations || 0;
          agent.mcpCalls = agent.mcpCalls || 0;
          agentStates.set(agent.agentId, agent);
        }
      }

      // Restore active skills/MCP
      for (const skill of data.activeSkills || []) {
        activeSkills.add(skill);
      }
      for (const mcp of data.activeMcpServers || []) {
        activeMcpServers.add(mcp);
      }

      console.log(`[${new Date().toISOString()}] Restored ${agentStates.size} agents from state file`);
    }
  } catch (err) {
    console.error('Failed to load agent state:', err);
  }
}

// Save state every 30 seconds
setInterval(saveAgentState, 30000);

// Validate agent ID format - must be a valid UUID (session_id format)
function isValidAgentId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Find the next available number for a source (fills gaps from removed agents)
function getNextAgentNumber(source: 'claude' | 'windsurf' | 'unknown'): number {
  const usedNumbers = new Set<number>();
  for (const state of agentStates.values()) {
    if (state.source === source) {
      const match = state.displayName.match(/(\d+)$/);
      if (match) {
        usedNumbers.add(parseInt(match[1], 10));
      }
    }
  }
  let num = 1;
  while (usedNumbers.has(num)) {
    num++;
  }
  return num;
}

// Determine agent role from context
function determineAgentRole(
  agentType?: string,
  parentAgentId?: string,
  agentName?: string
): AgentRole {
  // If has parent, it's a sub-agent
  if (parentAgentId) return 'sub-agent';

  // Known specialist agent types
  const specialistTypes = ['plan', 'explore', 'bash', 'researcher', 'reviewer', 'writer', 'analyst'];
  if (agentType && specialistTypes.includes(agentType.toLowerCase())) {
    return 'specialist';
  }

  // Check agent name for specialist patterns
  if (agentName) {
    const nameLower = agentName.toLowerCase();
    if (specialistTypes.some(t => nameLower.includes(t))) {
      return 'specialist';
    }
  }

  return 'main';
}

// Generate display name from available context
function generateDisplayName(
  source: 'claude' | 'windsurf' | 'unknown',
  agentNumber: number,
  agentName?: string,
  agentType?: string,
  agentRole?: AgentRole
): string {
  // If custom agent name provided, use it
  if (agentName) {
    // Capitalize first letter
    const formattedName = agentName.charAt(0).toUpperCase() + agentName.slice(1);
    return `${formattedName} ${agentNumber}`;
  }

  const sourceName = source === 'claude' ? 'Claude Code' :
                     source === 'windsurf' ? 'Windsurf' : 'Agent';

  // Include agent type if available
  if (agentType) {
    const typeLabel = agentType.charAt(0).toUpperCase() + agentType.slice(1);
    return `${sourceName} ${typeLabel} ${agentNumber}`;
  }

  // Include role if it's a specialist
  if (agentRole === 'specialist') {
    return `${sourceName} Specialist ${agentNumber}`;
  }

  return `${sourceName} ${agentNumber}`;
}

// Safe agent registration with multiple protections
function registerAgent(
  agentId: string,
  timestamp: number,
  eventSource: string,
  agentSource: 'claude' | 'windsurf' | 'unknown' = 'unknown',
  agentName?: string,
  agentType?: string,
  parentAgentId?: string
): AgentThinkingState | null {
  // PROTECTION 1: Validate agent ID format
  if (!isValidAgentId(agentId)) {
    console.log(`[${new Date().toISOString()}] REJECTED invalid agent ID: ${agentId} (${eventSource})`);
    return null;
  }

  // Check if agent already exists
  let state = agentStates.get(agentId);
  if (state) {
    return state;
  }

  // PROTECTION 2: Hard limit on total agents
  if (agentStates.size >= MAX_AGENTS) {
    console.log(`[${new Date().toISOString()}] REJECTED new agent - at max capacity (${MAX_AGENTS}): ${agentId}`);
    return null;
  }

  // PROTECTION 3: Rate limiting
  const now = Date.now();
  if (now - lastAgentCreationTime < AGENT_CREATION_COOLDOWN_MS) {
    console.log(`[${new Date().toISOString()}] REJECTED new agent - rate limited: ${agentId}`);
    return null;
  }

  // All checks passed - create the agent
  lastAgentCreationTime = now;
  const agentNumber = getNextAgentNumber(agentSource);
  const agentRole = determineAgentRole(agentType, parentAgentId, agentName);
  const displayName = generateDisplayName(agentSource, agentNumber, agentName, agentType, agentRole);

  state = {
    agentId,
    source: agentSource,
    isThinking: false,
    lastActivity: timestamp,
    displayName,
    currentCommand: undefined,
    toolCategory: undefined,
    agentType,
    agentName,
    agentRole,
    parentAgentId,
    childAgentIds: [],
    // Statistics
    operationCount: 0,
    fileReads: 0,
    fileWrites: 0,
    skillInvocations: 0,
    mcpCalls: 0,
  };

  agentStates.set(agentId, state);

  // If this is a sub-agent, register with parent
  if (parentAgentId && agentStates.has(parentAgentId)) {
    const parentState = agentStates.get(parentAgentId)!;
    if (!parentState.childAgentIds) parentState.childAgentIds = [];
    parentState.childAgentIds.push(agentId);
  }

  console.log(`[${new Date().toISOString()}] New agent registered: ${displayName} (${agentId.slice(0, 8)}) [${eventSource}] role=${agentRole}`);
  return state;
}

// Cleanup stale agents periodically
setInterval(() => {
  const now = Date.now();
  let removedAny = false;
  for (const [agentId, state] of agentStates) {
    if (now - state.lastActivity > AGENT_TIMEOUT_MS) {
      console.log(`[${new Date().toISOString()}] Removing stale agent: ${state.displayName} (${agentId})`);
      agentStates.delete(agentId);

      // Clear from parent's child list
      if (state.parentAgentId) {
        const parent = agentStates.get(state.parentAgentId);
        if (parent && parent.childAgentIds) {
          parent.childAgentIds = parent.childAgentIds.filter(id => id !== agentId);
        }
      }

      // Clear skill/MCP if no other agent using them
      if (state.skillName) {
        const stillUsed = Array.from(agentStates.values()).some(a => a.skillName === state.skillName);
        if (!stillUsed) activeSkills.delete(state.skillName);
      }
      if (state.mcpServer) {
        const stillUsed = Array.from(agentStates.values()).some(a => a.mcpServer === state.mcpServer);
        if (!stillUsed) activeMcpServers.delete(state.mcpServer);
      }

      removedAny = true;
    }
  }
  if (removedAny) {
    wsManager.broadcast('thinking', getAgentStatesArray());
  }
}, 60000);

// Periodic sync broadcast
setInterval(() => {
  if (agentStates.size > 0) {
    const now = Date.now();

    for (const state of agentStates.values()) {
      if (state.pendingToolStart && !state.waitingForInput) {
        const waitTime = now - state.pendingToolStart;
        if (waitTime > WAITING_FOR_INPUT_THRESHOLD_MS) {
          state.waitingForInput = true;
          console.log(`[${new Date().toISOString()}] Agent ${state.displayName} appears to be waiting for permission (${waitTime}ms)`);
        }
      }
    }

    wsManager.broadcast('thinking', getAgentStatesArray());
  }
}, 2000);

function getAgentStatesArray(): AgentThinkingState[] {
  return Array.from(agentStates.values());
}

// Generate system summary
function getSystemSummary(): SystemSummary {
  const agents = Array.from(agentStates.values());
  const activeAgents = agents.filter(a => a.isThinking || (Date.now() - a.lastActivity < 30000));

  return {
    totalAgents: agents.length,
    activeAgents: activeAgents.length,
    mainAgents: agents.filter(a => a.agentRole === 'main').length,
    subAgents: agents.filter(a => a.agentRole === 'sub-agent').length,
    specialists: agents.filter(a => a.agentRole === 'specialist').length,
    totalOperations: agents.reduce((sum, a) => sum + a.operationCount, 0),
    activeSkills: Array.from(activeSkills),
    activeMcpServers: Array.from(activeMcpServers),
    fileActivity: {
      reads: agents.reduce((sum, a) => sum + a.fileReads, 0),
      writes: agents.reduce((sum, a) => sum + a.fileWrites, 0),
      searches: 0, // Would need to track this
    },
  };
}

// Receive activity events from hook script
app.post('/api/activity', (req, res) => {
  const event: FileActivityEvent = req.body;
  const { skillName, mcpServer } = event;
  const now = Date.now();

  console.log(`[${new Date().toISOString()}] ${event.type.toUpperCase()}: ${event.filePath}${event.agentId ? ` (${event.agentId.slice(0, 8)})` : ''}${skillName ? ` [skill:${skillName}]` : ''}${mcpServer ? ` [mcp:${mcpServer}]` : ''}`);

  // Track in debug buffer
  recentActivityBuffer.push({
    type: event.type,
    filePath: toRelativePath(event.filePath),
    agentId: event.agentId,
    timestamp: now,
    skillName,
    mcpServer,
  });
  if (recentActivityBuffer.length > MAX_ACTIVITY_BUFFER) {
    recentActivityBuffer.shift();
  }

  // Register or get existing agent
  if (event.agentId) {
    const state = registerAgent(event.agentId, now, 'activity', event.source || 'unknown');
    if (state) {
      state.lastActivity = now;
      state.operationCount++;

      // Update current command and thinking state
      if (event.type.endsWith('-start')) {
        state.currentCommand = event.type.startsWith('read') ? 'Read' :
                               event.type.startsWith('write') ? 'Write' : 'Grep';
        state.toolCategory = event.type.includes('search') ? 'search' : 'file';
        state.isThinking = true;

        // Track file operations
        if (event.type.startsWith('read')) state.fileReads++;
        if (event.type.startsWith('write')) state.fileWrites++;
      } else if (event.type.endsWith('-end')) {
        state.isThinking = false;
      }

      // Track skill context
      if (skillName) {
        state.skillName = skillName;
        activeSkills.add(skillName);
      }

      // Track MCP context
      if (mcpServer) {
        state.mcpServer = mcpServer;
        state.mcpCalls++;
        activeMcpServers.add(mcpServer);
      }

      wsManager.broadcast('thinking', getAgentStatesArray());
    }
  }

  const graphData = activityStore.addActivity(event);

  // Broadcast with relative path
  const clientEvent = {
    ...event,
    filePath: toRelativePath(event.filePath)
  };
  wsManager.broadcast('activity', clientEvent);
  wsManager.broadcast('graph', graphData);

  res.status(200).json({ success: true });
});

// Receive thinking events
app.post('/api/thinking', (req, res) => {
  const event: ThinkingEvent = req.body;
  const {
    agentId, type, toolName, toolInput, agentType, model, duration, status,
    agentName, agentRole, parentAgentId, skillName, skillCommand, mcpServer, mcpTool
  } = event;
  const now = Date.now();

  // Register or get existing agent
  const state = registerAgent(
    agentId, now, 'thinking', event.source || 'unknown',
    agentName, agentType, parentAgentId
  );
  if (!state) {
    res.status(200).json({ success: true, rejected: true });
    return;
  }

  // Handle agent-stop events
  if (type === 'agent-stop') {
    if (status) {
      state.status = status;
      state.statusTimestamp = now;
      state.isThinking = false;
      console.log(`[${new Date().toISOString()}] AGENT-STOP: ${state.displayName} status=${status}`);
    }
    wsManager.broadcast('thinking', getAgentStatesArray());
    res.status(200).json({ success: true });
    return;
  }

  state.isThinking = type === 'thinking-start';
  state.lastActivity = now;
  state.operationCount++;

  // Update current command
  if (toolName) {
    state.currentCommand = toolName;
    state.toolCategory = categorizeToolool(toolName, mcpServer);
  }

  // Update tool input
  if (toolInput) {
    state.toolInput = toolInput;
  } else if (type === 'thinking-start') {
    state.toolInput = undefined;
  }

  // Update agent name if provided and not already set
  if (agentName && !state.agentName) {
    state.agentName = agentName;
    // Regenerate display name with the custom name
    const num = state.displayName.match(/\d+$/)?.[0] || '1';
    state.displayName = generateDisplayName(
      state.source, parseInt(num), agentName, state.agentType, state.agentRole
    );
  }

  // Update agent type if provided
  if (agentType && agentType !== state.agentType) {
    state.agentType = agentType;
    state.agentRole = determineAgentRole(agentType, state.parentAgentId, state.agentName);
    const num = state.displayName.match(/\d+$/)?.[0] || '1';
    state.displayName = generateDisplayName(
      state.source, parseInt(num), state.agentName, agentType, state.agentRole
    );
  }

  // Update model
  if (model && !state.model) {
    state.model = model;
    console.log(`[${new Date().toISOString()}] Agent ${state.displayName} using model: ${model}`);
  }

  // Update duration
  if (duration !== undefined && duration !== null) {
    state.lastDuration = duration;
  }

  // Skill tracking
  if (skillName) {
    state.skillName = skillName;
    state.skillInvocations++;
    activeSkills.add(skillName);
  }
  if (skillCommand) {
    state.skillCommand = skillCommand;
  }

  // MCP tracking
  if (mcpServer) {
    state.mcpServer = mcpServer;
    state.mcpCalls++;
    activeMcpServers.add(mcpServer);
  }
  if (mcpTool) {
    state.mcpTool = mcpTool;
  }

  // Clear status after activity resumes
  if (state.status && type === 'thinking-end') {
    state.status = undefined;
    state.statusTimestamp = undefined;
  }

  // Permission prompt detection
  if (type === 'thinking-end') {
    state.pendingToolStart = now;
    if (toolName === 'AskUserQuestion') {
      state.waitingForInput = true;
      console.log(`[${new Date().toISOString()}] Agent ${state.displayName} waiting for user input (AskUserQuestion)`);
    }
  } else if (type === 'thinking-start') {
    state.pendingToolStart = undefined;
    state.waitingForInput = false;
  }

  const durationStr = duration ? ` (${duration}ms)` : '';
  const skillStr = skillName ? ` [skill:${skillName}]` : '';
  const mcpStr = mcpServer ? ` [mcp:${mcpServer}/${mcpTool || ''}]` : '';
  console.log(`[${new Date().toISOString()}] ${type.toUpperCase()}: ${state.displayName} ${toolName ? `(${toolName})` : ''}${toolInput ? ` [${toolInput}]` : ''}${durationStr}${skillStr}${mcpStr}`);

  wsManager.broadcast('thinking', getAgentStatesArray());

  res.status(200).json({ success: true });
});

// Get all agent thinking states
app.get('/api/thinking', (_req, res) => {
  res.json(getAgentStatesArray());
});

// Get system summary (multi-agent dashboard)
app.get('/api/summary', (_req, res) => {
  res.json(getSystemSummary());
});

// Get current graph state
app.get('/api/graph', (_req, res) => {
  res.json(activityStore.getGraphData());
});

// Get hot folders based on git history + live activity
app.get('/api/hot-folders', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  try {
    const hotFolders = await getHotFolders(PROJECT_ROOT, limit);

    // Merge live activity
    const recentlyActive = activityStore.getRecentlyActiveFiles(10 * 60 * 1000);
    for (const folder of hotFolders) {
      const liveFiles = recentlyActive.get(folder.folder);
      if (liveFiles && liveFiles.length > 0) {
        const merged = [...liveFiles];
        for (const file of folder.recentFiles) {
          if (!merged.includes(file)) {
            merged.push(file);
          }
        }
        folder.recentFiles = merged.slice(0, 8);
      }
    }

    // Add live-only folders
    for (const [folderPath, files] of recentlyActive) {
      if (!hotFolders.find(f => f.folder === folderPath)) {
        hotFolders.push({
          folder: folderPath,
          score: files.length * 10,
          recentFiles: files.slice(0, 8)
        });
      }
    }

    hotFolders.sort((a, b) => b.score - a.score);
    res.json(hotFolders.slice(0, limit));
  } catch (error) {
    console.error('Error getting hot folders:', error);
    res.status(500).json({ error: 'Failed to get hot folders' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    clients: wsManager.getClientCount(),
    projectRoot: PROJECT_ROOT,
    agents: agentStates.size,
    activeSkills: activeSkills.size,
    activeMcpServers: activeMcpServers.size,
  });
});

// Debug endpoint
app.get('/api/debug', (_req, res) => {
  const now = Date.now();
  res.json({
    server: {
      uptime: Math.floor((now - SERVER_START_TIME) / 1000),
      uptimeFormatted: `${Math.floor((now - SERVER_START_TIME) / 60000)}m ${Math.floor(((now - SERVER_START_TIME) % 60000) / 1000)}s`,
      projectRoot: PROJECT_ROOT,
      wsClients: wsManager.getClientCount(),
    },
    agents: Array.from(agentStates.values()).map(agent => ({
      ...agent,
      agentId: agent.agentId.slice(0, 8) + '...',
      lastActivityAgo: `${Math.floor((now - agent.lastActivity) / 1000)}s ago`,
      willTimeoutIn: `${Math.floor((AGENT_TIMEOUT_MS - (now - agent.lastActivity)) / 1000)}s`,
    })),
    summary: getSystemSummary(),
    agentCount: agentStates.size,
    maxAgents: MAX_AGENTS,
    activeSkills: Array.from(activeSkills),
    activeMcpServers: Array.from(activeMcpServers),
    recentActivity: recentActivityBuffer.slice(-20).map(a => ({
      ...a,
      agentId: a.agentId ? a.agentId.slice(0, 8) + '...' : undefined,
      ago: `${Math.floor((now - a.timestamp) / 1000)}s ago`,
    })),
    config: {
      agentTimeoutMs: AGENT_TIMEOUT_MS,
      agentCreationCooldownMs: AGENT_CREATION_COOLDOWN_MS,
    }
  });
});

// Clear graph
app.post('/api/clear', (_req, res) => {
  activityStore.clear();
  wsManager.broadcast('graph', activityStore.getGraphData());
  res.json({ success: true });
});

// Handle git commit notification
app.post('/api/git-commit', async (_req, res) => {
  console.log(`[${new Date().toISOString()}] Git commit detected - refreshing layout`);
  clearGitCache(PROJECT_ROOT);

  try {
    const hotFolders = await getHotFolders(PROJECT_ROOT, 50);
    wsManager.broadcast('layout-update', { hotFolders, timestamp: Date.now() });
    res.json({ success: true, foldersUpdated: hotFolders.length });
  } catch (error) {
    console.error('Failed to refresh layout after git commit:', error);
    res.status(500).json({ error: 'Failed to refresh layout' });
  }
});

// Load persisted state before starting server
loadAgentState();

server.listen(PORT, () => {
  console.log(`
  CodeMap Server (Multi-Agent Enhanced)
  ======================================
  HTTP:      http://localhost:${PORT}
  WebSocket: ws://localhost:${PORT}/ws
  Project:   ${PROJECT_ROOT}
  Agents:    ${agentStates.size} restored
  Skills:    ${activeSkills.size} active
  MCP:       ${activeMcpServers.size} servers
  `);
});
