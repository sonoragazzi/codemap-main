/**
 * Shared TypeScript Types
 *
 * These types are used across the server for:
 * - Activity events from hooks (file read/write)
 * - Thinking events from hooks (agent state)
 * - Graph data for visualization (file tree)
 *
 * Enhanced for multi-agent system support:
 * - Custom agent names from .claude/agents/
 * - Skill tracking and invocation
 * - MCP server identification
 * - Agent hierarchy (main/sub-agent)
 */

/** Agent source - which IDE/tool the agent is from */
export type AgentSource = 'claude' | 'windsurf' | 'unknown';

/** Agent role in multi-agent system */
export type AgentRole = 'main' | 'sub-agent' | 'specialist';

/** Tool category for visual differentiation */
export type ToolCategory = 'file' | 'search' | 'execute' | 'skill' | 'mcp' | 'task' | 'other';

/**
 * File activity event from file-activity-hook.sh
 * Tracks when an agent reads or writes a file
 */
export interface FileActivityEvent {
  type: 'read-start' | 'read-end' | 'write-start' | 'write-end' | 'search-start' | 'search-end';
  filePath: string;  // For search: this is the search pattern (glob or regex)
  agentId?: string;  // Which agent triggered this activity
  source?: AgentSource;  // Which tool (claude/windsurf)
  timestamp: number;
  // Enhanced fields for multi-agent support
  skillName?: string;  // Active skill context (e.g., "gara-write", "script-write")
  mcpServer?: string;  // MCP server if applicable (e.g., "perplexity", "tavily")
}

/** Agent status from stop events */
export type AgentStatus = 'completed' | 'aborted' | 'error';

/**
 * Thinking event from thinking-hook.sh
 * Enhanced for multi-agent and skill tracking
 */
export interface ThinkingEvent {
  type: 'thinking-start' | 'thinking-end' | 'agent-stop';
  agentId: string;
  source?: AgentSource;  // Which tool (claude/windsurf)
  timestamp: number;
  toolName?: string;  // Current tool being used (e.g., "Read", "Edit", "Bash", "Skill")
  toolInput?: string;  // Abbreviated tool input (file path, command, pattern)
  agentType?: string;  // Agent type from SessionStart (e.g., "Plan", "Explore", "Bash")
  model?: string;  // Model name (e.g., "claude-3.5-sonnet", "opus")
  duration?: number;  // Operation duration in ms
  status?: AgentStatus;  // Agent completion status - from stop hook
  loopCount?: number;  // Number of agent loops - from stop hook
  // Enhanced fields for multi-agent support
  agentName?: string;  // Custom agent name (e.g., "writer", "story-architect")
  agentRole?: AgentRole;  // Role in multi-agent hierarchy
  parentAgentId?: string;  // Parent agent ID for sub-agents
  skillName?: string;  // Active skill being executed (e.g., "gara-write")
  skillCommand?: string;  // Original command invoked (e.g., "/gara-write C04 1")
  mcpServer?: string;  // MCP server name (e.g., "perplexity", "notebooklm")
  mcpTool?: string;  // Specific MCP tool (e.g., "perplexity_search")
  ruleContext?: string[];  // Active rules (e.g., ["quality-gates", "writing-standards"])
}

/**
 * Agent thinking state - comprehensive multi-agent support
 */
export interface AgentThinkingState {
  agentId: string;
  source: AgentSource;  // Which tool this agent is from
  isThinking: boolean;
  lastActivity: number;
  displayName: string;  // Formatted display name
  currentCommand?: string;  // Current tool/command being executed
  toolInput?: string;  // Abbreviated tool input (file path, command, pattern)
  toolCategory?: ToolCategory;  // Category for visual styling
  waitingForInput?: boolean;  // True when agent is waiting for user input
  pendingToolStart?: number;  // Timestamp when tool started
  agentType?: string;  // Agent type (e.g., "Plan", "Explore", "Bash")
  model?: string;  // Model name (e.g., "claude-3.5-sonnet")
  lastDuration?: number;  // Last operation duration in ms
  status?: AgentStatus;  // Completion status (completed/aborted/error)
  statusTimestamp?: number;  // When status was set (for auto-clearing)
  // Enhanced fields for multi-agent support
  agentName?: string;  // Custom agent name (e.g., "writer", "reviewer")
  agentRole: AgentRole;  // Role: main, sub-agent, specialist
  parentAgentId?: string;  // Parent agent ID for sub-agents
  childAgentIds?: string[];  // Child agent IDs spawned by this agent
  skillName?: string;  // Currently active skill
  skillCommand?: string;  // Original skill command
  mcpServer?: string;  // Active MCP server
  mcpTool?: string;  // Active MCP tool
  activeRules?: string[];  // Active rules context
  // Statistics
  operationCount: number;  // Total operations performed
  fileReads: number;  // Files read count
  fileWrites: number;  // Files written count
  skillInvocations: number;  // Skills invoked count
  mcpCalls: number;  // MCP tool calls count
}

/**
 * Categorize tool by type for visual differentiation
 */
export function categorizeToolool(toolName: string, mcpServer?: string): ToolCategory {
  if (mcpServer) return 'mcp';

  const toolLower = toolName.toLowerCase();

  // File operations
  if (['read', 'write', 'edit', 'multiedit', 'notebookedit'].includes(toolLower)) {
    return 'file';
  }

  // Search operations
  if (['grep', 'glob', 'websearch', 'webfetch'].includes(toolLower)) {
    return 'search';
  }

  // Execution operations
  if (['bash', 'killshell'].includes(toolLower)) {
    return 'execute';
  }

  // Task/agent spawning
  if (['task', 'taskoutput'].includes(toolLower)) {
    return 'task';
  }

  // Skill invocation
  if (toolLower === 'skill') {
    return 'skill';
  }

  return 'other';
}

export interface GraphNode {
  id: string;
  name: string;
  isFolder: boolean;
  depth: number;
  lastActivity?: {
    type: 'read' | 'write' | 'search';
    timestamp: number;
    agentId?: string;  // Which agent performed the activity
  };
  activeOperation?: 'read' | 'write' | 'search';
  activityCount: {
    reads: number;
    writes: number;
    searches: number;
  };
  // Enhanced: track which agents accessed this file
  accessedBy?: string[];  // Agent IDs that accessed this file
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/** Layout update data - sent when git commit triggers a layout refresh */
export interface LayoutUpdateData {
  hotFolders: Array<{
    folder: string;
    score: number;
    recentFiles: string[];
  }>;
  timestamp: number;
}

/**
 * Multi-agent system summary - useful for dashboard
 */
export interface SystemSummary {
  totalAgents: number;
  activeAgents: number;
  mainAgents: number;
  subAgents: number;
  specialists: number;
  totalOperations: number;
  activeSkills: string[];
  activeMcpServers: string[];
  fileActivity: {
    reads: number;
    writes: number;
    searches: number;
  };
}
