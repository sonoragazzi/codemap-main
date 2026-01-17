#!/bin/bash
# Universal hook script - works with BOTH Claude Code AND Windsurf
# Captures thinking state, agent context, skills, and MCP info
# Enhanced for multi-agent system visualization

EVENT_TYPE="$1"  # "thinking-start" or "thinking-end"
SERVER_URL="http://localhost:5174/api/thinking"
LOG_FILE="/tmp/codemap-hook.log"

# Read JSON from stdin
INPUT=$(cat)

# UNIVERSAL: Extract session ID - works for Claude Code OR Windsurf
# Claude uses session_id, Windsurf uses conversation_id
AGENT_ID=$(echo "$INPUT" | /usr/bin/jq -r '.session_id // .conversation_id // empty' 2>/dev/null)

if [ -z "$AGENT_ID" ]; then
    echo "$(date): SKIP - no session_id/conversation_id" >> "$LOG_FILE"
    exit 0
fi

# UNIVERSAL: Extract tool name - works for both tools
# Claude: tool_name, Windsurf: tool_name or command (for shell)
TOOL_NAME=$(echo "$INPUT" | /usr/bin/jq -r '.tool_name // .command // empty' 2>/dev/null)

# Extract tool input for visualization (file path, command, pattern)
# Truncate to 30 chars to keep bubble readable
TOOL_INPUT=""
case "$TOOL_NAME" in
    Read|Write|Edit)
        TOOL_INPUT=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.file_path // empty' 2>/dev/null)
        # Extract just the filename for brevity
        if [ -n "$TOOL_INPUT" ]; then
            TOOL_INPUT=$(basename "$TOOL_INPUT" 2>/dev/null)
        fi
        ;;
    Bash)
        # Get first 30 chars of command, avoid exposing full commands
        TOOL_INPUT=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.command // empty' 2>/dev/null | head -c 30)
        ;;
    Grep|Glob)
        TOOL_INPUT=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.pattern // empty' 2>/dev/null | head -c 30)
        ;;
    Task)
        # Show subagent type for Task tool
        TOOL_INPUT=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.subagent_type // .tool_input.description // empty' 2>/dev/null | head -c 30)
        ;;
    Skill)
        # Show skill name for Skill tool
        TOOL_INPUT=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.skill // .tool_input.name // empty' 2>/dev/null | head -c 30)
        ;;
esac

# Extract agent type if available (from SessionStart or agent field)
AGENT_TYPE=$(echo "$INPUT" | /usr/bin/jq -r '.agent_type // .agent // empty' 2>/dev/null)

# Extract model name (Windsurf provides this in all hooks)
MODEL=$(echo "$INPUT" | /usr/bin/jq -r '.model // empty' 2>/dev/null)

# Extract duration if available (Windsurf afterShellExecution, afterMCPExecution)
DURATION=$(echo "$INPUT" | /usr/bin/jq -r '.duration // .duration_ms // empty' 2>/dev/null)

# ===== MULTI-AGENT ENHANCEMENTS =====

# Extract custom agent name (from Task tool description or agent_name field)
AGENT_NAME=$(echo "$INPUT" | /usr/bin/jq -r '.agent_name // .tool_input.agent_name // empty' 2>/dev/null)
# Also check for description that looks like an agent name
if [ -z "$AGENT_NAME" ] && [ "$TOOL_NAME" = "Task" ]; then
    AGENT_NAME=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.description // empty' 2>/dev/null | head -c 20)
fi

# Extract parent agent ID for sub-agents
PARENT_AGENT_ID=$(echo "$INPUT" | /usr/bin/jq -r '.parent_session_id // .parent_agent_id // empty' 2>/dev/null)

# Extract skill information when Skill tool is used
SKILL_NAME=""
SKILL_COMMAND=""
if [ "$TOOL_NAME" = "Skill" ]; then
    SKILL_NAME=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.skill // .tool_input.name // empty' 2>/dev/null)
    SKILL_COMMAND=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.args // empty' 2>/dev/null)
    if [ -n "$SKILL_NAME" ] && [ -n "$SKILL_COMMAND" ]; then
        SKILL_COMMAND="/$SKILL_NAME $SKILL_COMMAND"
    elif [ -n "$SKILL_NAME" ]; then
        SKILL_COMMAND="/$SKILL_NAME"
    fi
fi

# Extract MCP server and tool information
# MCP tools typically have names like "mcp__servername__toolname"
MCP_SERVER=""
MCP_TOOL=""
if [[ "$TOOL_NAME" == mcp__* ]]; then
    # Parse mcp__server__tool format
    MCP_SERVER=$(echo "$TOOL_NAME" | cut -d'_' -f3)
    MCP_TOOL=$(echo "$TOOL_NAME" | cut -d'_' -f4-)
fi
# Also check for explicit mcp_server field
if [ -z "$MCP_SERVER" ]; then
    MCP_SERVER=$(echo "$INPUT" | /usr/bin/jq -r '.mcp_server // .tool_input.mcp_server // empty' 2>/dev/null)
fi
if [ -z "$MCP_TOOL" ]; then
    MCP_TOOL=$(echo "$INPUT" | /usr/bin/jq -r '.mcp_tool // .tool_input.mcp_tool // empty' 2>/dev/null)
fi

# Detect source for logging (optional)
SOURCE="unknown"
echo "$INPUT" | /usr/bin/jq -e '.session_id' >/dev/null 2>&1 && SOURCE="claude"
echo "$INPUT" | /usr/bin/jq -e '.conversation_id' >/dev/null 2>&1 && SOURCE="windsurf"

# Log for debugging (enhanced)
echo "$(date): [$SOURCE] THINKING $EVENT_TYPE agent=${AGENT_ID:0:8} tool=$TOOL_NAME model=$MODEL skill=$SKILL_NAME mcp=$MCP_SERVER" >> "$LOG_FILE"

# Build JSON payload with all available fields
# Start with base fields
JSON_PAYLOAD="{\"type\":\"$EVENT_TYPE\",\"agentId\":\"$AGENT_ID\",\"source\":\"$SOURCE\",\"timestamp\":$(date +%s000)"

# Add optional fields if present
if [ -n "$TOOL_NAME" ]; then
    JSON_PAYLOAD="$JSON_PAYLOAD,\"toolName\":\"$TOOL_NAME\""
fi
if [ -n "$TOOL_INPUT" ]; then
    # Escape special characters in tool input for JSON
    ESCAPED_INPUT=$(echo "$TOOL_INPUT" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr -d '\n')
    JSON_PAYLOAD="$JSON_PAYLOAD,\"toolInput\":\"$ESCAPED_INPUT\""
fi
if [ -n "$AGENT_TYPE" ]; then
    JSON_PAYLOAD="$JSON_PAYLOAD,\"agentType\":\"$AGENT_TYPE\""
fi
if [ -n "$MODEL" ]; then
    JSON_PAYLOAD="$JSON_PAYLOAD,\"model\":\"$MODEL\""
fi
if [ -n "$DURATION" ] && [ "$DURATION" != "null" ]; then
    JSON_PAYLOAD="$JSON_PAYLOAD,\"duration\":$DURATION"
fi

# Multi-agent fields
if [ -n "$AGENT_NAME" ]; then
    ESCAPED_NAME=$(echo "$AGENT_NAME" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr -d '\n')
    JSON_PAYLOAD="$JSON_PAYLOAD,\"agentName\":\"$ESCAPED_NAME\""
fi
if [ -n "$PARENT_AGENT_ID" ]; then
    JSON_PAYLOAD="$JSON_PAYLOAD,\"parentAgentId\":\"$PARENT_AGENT_ID\""
fi
if [ -n "$SKILL_NAME" ]; then
    ESCAPED_SKILL=$(echo "$SKILL_NAME" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr -d '\n')
    JSON_PAYLOAD="$JSON_PAYLOAD,\"skillName\":\"$ESCAPED_SKILL\""
fi
if [ -n "$SKILL_COMMAND" ]; then
    ESCAPED_CMD=$(echo "$SKILL_COMMAND" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr -d '\n')
    JSON_PAYLOAD="$JSON_PAYLOAD,\"skillCommand\":\"$ESCAPED_CMD\""
fi
if [ -n "$MCP_SERVER" ]; then
    JSON_PAYLOAD="$JSON_PAYLOAD,\"mcpServer\":\"$MCP_SERVER\""
fi
if [ -n "$MCP_TOOL" ]; then
    JSON_PAYLOAD="$JSON_PAYLOAD,\"mcpTool\":\"$MCP_TOOL\""
fi

# Close the JSON object
JSON_PAYLOAD="$JSON_PAYLOAD}"

# Send event to server (non-blocking with timeout)
/usr/bin/curl -s -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD" \
    --connect-timeout 1 \
    --max-time 2 \
    >/dev/null 2>&1 &

# For Grep/Glob tools, also send a search activity event
if [ "$TOOL_NAME" = "Grep" ] || [ "$TOOL_NAME" = "Glob" ]; then
    # Extract pattern for search visualization
    SEARCH_PATTERN=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.pattern // empty' 2>/dev/null)
    SEARCH_PATH=$(echo "$INPUT" | /usr/bin/jq -r '.tool_input.path // "." // empty' 2>/dev/null)

    if [ -n "$SEARCH_PATTERN" ]; then
        ACTIVITY_URL="http://localhost:5174/api/activity"
        SEARCH_EVENT_TYPE="search-start"
        if [ "$EVENT_TYPE" = "thinking-start" ]; then
            SEARCH_EVENT_TYPE="search-end"
        fi
        FILE_PATH="${SEARCH_PATH}:${SEARCH_PATTERN}"

        echo "$(date): [$SOURCE] FILE $SEARCH_EVENT_TYPE agent=${AGENT_ID:0:8} file=$(basename "$FILE_PATH" 2>/dev/null)" >> "$LOG_FILE"

        /usr/bin/curl -s -X POST "$ACTIVITY_URL" \
            -H "Content-Type: application/json" \
            -d "{\"type\":\"$SEARCH_EVENT_TYPE\",\"filePath\":\"$FILE_PATH\",\"agentId\":\"$AGENT_ID\",\"source\":\"$SOURCE\",\"timestamp\":$(date +%s000)}" \
            --connect-timeout 1 \
            --max-time 2 \
            >/dev/null 2>&1 &
    fi
fi

# Always exit successfully to not block Claude Code
exit 0
