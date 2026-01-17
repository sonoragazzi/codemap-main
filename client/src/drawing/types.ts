// Drawing types for CodeMap Coworking visualization
// Enhanced for multi-agent system support

export const TILE_SIZE = 16;

export interface Character {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isMoving: boolean;
  frame: number;
}

/** Agent status from stop events */
export type AgentStatus = 'completed' | 'aborted' | 'error';

/** Agent source - which IDE/tool the agent is from */
export type AgentSource = 'claude' | 'windsurf' | 'unknown';

/** Agent role in multi-agent system */
export type AgentRole = 'main' | 'sub-agent' | 'specialist';

/** Tool category for visual differentiation */
export type ToolCategory = 'file' | 'search' | 'execute' | 'skill' | 'mcp' | 'task' | 'other';

/**
 * Categorize tool by type for visual differentiation
 */
export function categorizeToolByName(toolName: string, mcpServer?: string): ToolCategory {
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

export interface AgentCharacter extends Character {
  agentId: string;
  displayName: string;
  colorIndex: number;
  currentCommand?: string;
  toolInput?: string;  // File path, command, or pattern being operated on
  waitingForInput?: boolean;
  isIdle?: boolean;
  lastActivity: number;
  lastSeen: number;  // When agent was last seen in server's list (for grace period removal)
  isThinking?: boolean;
  agentType?: string;  // Agent type (Plan, Explore, Bash, etc.)
  model?: string;  // Model name (e.g., "claude-3.5-sonnet")
  lastDuration?: number;  // Last operation duration in ms
  status?: AgentStatus;  // Completion status
  statusTimestamp?: number;  // When status was set
  // Multi-agent enhancements
  source?: AgentSource;  // Which IDE this agent is from
  agentName?: string;  // Custom agent name (e.g., "writer", "reviewer")
  agentRole?: AgentRole;  // Role: main, sub-agent, specialist
  parentAgentId?: string;  // Parent agent ID for sub-agents
  childAgentIds?: string[];  // Child agent IDs spawned by this agent
  skillName?: string;  // Currently active skill
  skillCommand?: string;  // Original skill command
  mcpServer?: string;  // Active MCP server
  mcpTool?: string;  // Active MCP tool
  toolCategory?: ToolCategory;  // Category for visual styling
  // Statistics
  operationCount?: number;  // Total operations performed
  fileReads?: number;  // Files read count
  fileWrites?: number;  // Files written count
  skillInvocations?: number;  // Skills invoked count
  mcpCalls?: number;  // MCP tool calls count
}

export interface RoomLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  files: FileLayout[];
  children: RoomLayout[];
  depth: number;
  floorStyle: FloorStyle;
}

export interface FileLayout {
  x: number;
  y: number;
  name: string;
  id: string;
  isActive: boolean;
  isWriting: boolean;
  deskStyle: number;
  heatLevel: number;  // 0-1 based on activity count (reads + writes)
}

export interface ScreenFlash {
  type: 'read' | 'write' | 'search' | 'bash';
  startTime: number;
}

export type FloorStyle = 'wood' | 'green' | 'blue' | 'cream' | 'lavender' | 'peach';

export interface TileColors {
  base: string;
  highlight: string;
  shadowLight: string;
  shadowDark: string;
  grout: string;
}

export interface CharacterPalette {
  hair: { dark: string; mid: string; light: string };
  shirt: { dark: string; mid: string; light: string };
  pants: { base: string; shadow: string };
}
