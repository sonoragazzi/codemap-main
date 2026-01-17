// Agent character drawing function
// Enhanced for multi-agent system with skill/MCP visualization
import { AgentCharacter, ToolCategory, categorizeToolByName } from './types';
import { CHARACTER_PALETTES, SKIN, OUTLINE } from './palette';

// Color schemes for different tool categories
const TOOL_CATEGORY_COLORS: Record<ToolCategory, { bg: string; border: string; text: string }> = {
  file: { bg: '#E3F2FD', border: '#1976D2', text: '#0D47A1' },      // Blue
  search: { bg: '#FFF3E0', border: '#F57C00', text: '#E65100' },    // Orange
  execute: { bg: '#FCE4EC', border: '#C2185B', text: '#880E4F' },   // Pink
  skill: { bg: '#E8F5E9', border: '#388E3C', text: '#1B5E20' },     // Green
  mcp: { bg: '#F3E5F5', border: '#7B1FA2', text: '#4A148C' },       // Purple
  task: { bg: '#E0F7FA', border: '#0097A7', text: '#006064' },      // Cyan
  other: { bg: '#FFFFFF', border: '#9E9E9E', text: '#424242' }      // Gray
};

// Role badge colors
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  'main': { bg: '#2196F3', text: '#FFFFFF' },
  'sub-agent': { bg: '#FF9800', text: '#FFFFFF' },
  'specialist': { bg: '#9C27B0', text: '#FFFFFF' }
};

// Draw a single agent character with animations
export const drawAgentCharacter = (ctx: CanvasRenderingContext2D, char: AgentCharacter) => {
  const cx = char.x;
  const jumpOffset = char.waitingForInput ? Math.abs(Math.sin(char.frame * 0.15)) * 8 : 0;
  const cy = char.y - jumpOffset;
  const palette = CHARACTER_PALETTES[char.colorIndex % CHARACTER_PALETTES.length];
  const scale = 1.5;

  const blinkCycle = (char.frame % 180);
  const isBlinking = blinkCycle > 168 && blinkCycle < 180;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  const headTop = -32;
  const bodyTop = -16;
  const legsTop = -4;
  const feetBottom = 4;

  // Ground shadow
  ctx.fillStyle = 'rgba(60, 40, 20, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, feetBottom + 2, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walking animation - subtle leg offset when moving
  const walkCycle = char.isMoving ? Math.sin(char.frame * 0.3) * 1.5 : 0;
  const leftLegOffset = walkCycle;
  const rightLegOffset = -walkCycle;

  // Legs
  ctx.fillStyle = palette.pants.shadow;
  ctx.fillRect(-5, legsTop + leftLegOffset, 4, 8);
  ctx.fillStyle = palette.pants.base;
  ctx.fillRect(-5, legsTop + leftLegOffset, 3, 7);
  ctx.fillStyle = palette.pants.shadow;
  ctx.fillRect(1, legsTop + rightLegOffset, 4, 8);
  ctx.fillStyle = palette.pants.base;
  ctx.fillRect(1, legsTop + rightLegOffset, 3, 7);

  // Feet
  ctx.fillStyle = OUTLINE;
  ctx.fillRect(-6, feetBottom - 3 + leftLegOffset, 5, 3);
  ctx.fillRect(1, feetBottom - 3 + rightLegOffset, 5, 3);

  // Body/Torso
  ctx.fillStyle = palette.shirt.dark;
  ctx.fillRect(-7, bodyTop, 14, 12);
  ctx.fillStyle = palette.shirt.mid;
  ctx.fillRect(-6, bodyTop + 1, 12, 10);
  ctx.fillStyle = palette.shirt.light;
  ctx.fillRect(-5, bodyTop + 1, 4, 3);

  // Arms
  ctx.fillStyle = palette.shirt.dark;
  ctx.fillRect(-10, bodyTop + 1, 4, 9);
  ctx.fillStyle = palette.shirt.mid;
  ctx.fillRect(-10, bodyTop + 1, 3, 8);
  ctx.fillStyle = SKIN.shadow;
  ctx.fillRect(-10, bodyTop + 9, 3, 3);
  ctx.fillStyle = SKIN.base;
  ctx.fillRect(-10, bodyTop + 9, 2, 2);

  ctx.fillStyle = palette.shirt.dark;
  ctx.fillRect(6, bodyTop + 1, 4, 9);
  ctx.fillStyle = palette.shirt.mid;
  ctx.fillRect(6, bodyTop + 1, 3, 8);
  ctx.fillStyle = SKIN.shadow;
  ctx.fillRect(7, bodyTop + 9, 3, 3);
  ctx.fillStyle = SKIN.base;
  ctx.fillRect(7, bodyTop + 9, 2, 2);

  // Head - hair
  const hairStyle = char.colorIndex % 5;
  const hairDark = palette.hair.dark;
  const hairMid = palette.hair.mid;
  const hairLight = palette.hair.light;
  ctx.fillStyle = hairDark;

  if (hairStyle === 0) {
    ctx.fillRect(-7, headTop, 14, 12);
    ctx.fillRect(-8, headTop + 2, 2, 5);
    ctx.fillRect(6, headTop + 1, 2, 6);
    ctx.fillRect(-3, headTop - 2, 3, 3);
    ctx.fillRect(1, headTop - 1, 2, 2);
  } else if (hairStyle === 1) {
    ctx.fillRect(-8, headTop, 16, 16);
    ctx.fillRect(-9, headTop + 4, 2, 12);
    ctx.fillRect(7, headTop + 4, 2, 12);
  } else if (hairStyle === 2) {
    ctx.fillRect(-6, headTop, 12, 10);
    ctx.fillRect(-7, headTop + 2, 14, 6);
  } else if (hairStyle === 3) {
    ctx.fillRect(-7, headTop, 14, 11);
    ctx.fillRect(-5, headTop - 3, 3, 4);
    ctx.fillRect(2, headTop - 2, 3, 3);
    ctx.fillRect(-8, headTop + 1, 3, 6);
    ctx.fillRect(5, headTop, 4, 7);
  } else {
    ctx.fillRect(-7, headTop, 14, 12);
    ctx.fillRect(-9, headTop + 2, 4, 7);
    ctx.fillRect(4, headTop - 1, 4, 5);
  }

  ctx.fillStyle = hairMid;
  ctx.fillRect(-5, headTop + 3, 10, 7);
  ctx.fillStyle = hairLight;
  ctx.fillRect(-3, headTop + 3, 4, 2);

  // Face
  ctx.fillStyle = SKIN.base;
  ctx.fillRect(-5, headTop + 6, 10, 9);
  ctx.fillStyle = SKIN.shadow;
  ctx.fillRect(3, headTop + 7, 2, 7);

  // Bangs
  ctx.fillStyle = hairMid;
  if (hairStyle === 1) {
    ctx.fillRect(-5, headTop + 5, 8, 2);
    ctx.fillRect(-6, headTop + 6, 3, 2);
  } else {
    ctx.fillRect(-4, headTop + 5, 8, 2);
  }

  // Eyes
  const eyeY = headTop + 10;
  const eyesClosed = isBlinking || char.isIdle;
  if (eyesClosed) {
    ctx.fillStyle = '#282828';
    ctx.fillRect(-4, eyeY + 1, 2, 1);
    ctx.fillRect(2, eyeY + 1, 2, 1);
  } else {
    ctx.fillStyle = '#282828';
    ctx.fillRect(-4, eyeY, 2, 2);
    ctx.fillRect(2, eyeY, 2, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-4, eyeY, 1, 1);
    ctx.fillRect(2, eyeY, 1, 1);
  }

  // Mouth
  ctx.fillStyle = SKIN.shadow;
  ctx.fillRect(-1, headTop + 13, 2, 1);

  // Outline
  ctx.fillStyle = OUTLINE;
  ctx.fillRect(-6, headTop + 5, 1, 10);
  ctx.fillRect(5, headTop + 5, 1, 10);
  ctx.fillRect(-5, headTop + 15, 10, 1);

  ctx.restore();

  // Name label (not scaled)
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillText(char.displayName, cx + 1, cy - 50);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(char.displayName, cx, cy - 51);

  // Model label (below name, smaller, gray)
  if (char.model) {
    // Abbreviate model name: "claude-3.5-sonnet" → "3.5-sonnet"
    let modelShort = char.model;
    if (modelShort.startsWith('claude-')) {
      modelShort = modelShort.replace('claude-', '');
    } else if (modelShort.startsWith('gpt-')) {
      modelShort = modelShort.replace('gpt-', 'gpt');
    }
    // Truncate if too long
    if (modelShort.length > 15) {
      modelShort = modelShort.slice(0, 12) + '...';
    }
    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillText(modelShort, cx + 1, cy - 41);
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText(modelShort, cx, cy - 42);
  }

  // Status badge (completion indicator)
  if (char.status) {
    const statusConfig = {
      completed: { icon: '✓', bg: '#4CAF50', fg: '#FFFFFF' },
      aborted: { icon: '!', bg: '#FF9800', fg: '#FFFFFF' },
      error: { icon: '✗', bg: '#F44336', fg: '#FFFFFF' }
    };
    const config = statusConfig[char.status];
    const badgeX = cx + 20;
    const badgeY = cy - 55;

    // Badge background
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 8, 0, Math.PI * 2);
    ctx.fillStyle = config.bg;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Badge icon
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = config.fg;
    ctx.textAlign = 'center';
    ctx.fillText(config.icon, badgeX, badgeY + 3);
  }

  // ZZZ animation when idle
  if (char.isIdle) {
    ctx.font = 'bold 12px monospace';
    const zzzPhase = (char.frame * 0.05) % 3;
    const baseX = cx + 15;
    const baseY = cy - 60;

    for (let i = 0; i < 3; i++) {
      const offset = (zzzPhase + i) % 3;
      const zx = baseX + offset * 6;
      const zy = baseY - offset * 8;
      const alpha = 0.4 + (offset * 0.3);
      const size = 8 + offset * 2;

      ctx.font = `bold ${size}px monospace`;
      ctx.fillStyle = `rgba(100, 100, 180, ${alpha})`;
      ctx.fillText('z', zx + 1, zy + 1);
      ctx.fillStyle = `rgba(180, 180, 255, ${alpha})`;
      ctx.fillText('z', zx, zy);
    }
  }

  // Role badge (for sub-agents and specialists)
  if (char.agentRole && char.agentRole !== 'main') {
    const roleConfig = ROLE_COLORS[char.agentRole] || ROLE_COLORS['sub-agent'];
    const badgeX = cx - 25;
    const badgeY = cy - 55;

    ctx.font = '7px monospace';
    const roleText = char.agentRole === 'sub-agent' ? 'SUB' : 'SPE';
    const textWidth = ctx.measureText(roleText).width;

    // Badge background
    ctx.fillStyle = roleConfig.bg;
    ctx.beginPath();
    ctx.roundRect(badgeX - textWidth / 2 - 3, badgeY - 6, textWidth + 6, 12, 3);
    ctx.fill();

    // Badge text
    ctx.fillStyle = roleConfig.text;
    ctx.textAlign = 'center';
    ctx.fillText(roleText, badgeX, badgeY + 2);
  }

  // Speech bubble - enhanced for multi-agent system
  const showBubble = char.waitingForInput || char.currentCommand || char.skillName || char.mcpServer;
  if (showBubble) {
    const isStuck = char.waitingForInput;

    // Determine tool category for styling
    const toolCategory = char.toolCategory ||
      (char.currentCommand ? categorizeToolByName(char.currentCommand, char.mcpServer) : 'other');
    const categoryColors = TOOL_CATEGORY_COLORS[toolCategory];

    // Choose colors based on state
    const bubbleColor = isStuck ? '#FFE040' : categoryColors.bg;
    const borderColor = isStuck ? '#D0A000' : categoryColors.border;
    const textColor = isStuck ? '#604000' : categoryColors.text;
    const secondaryColor = '#666666';

    // Format duration if available
    let durationStr = '';
    if (!isStuck && char.lastDuration !== undefined) {
      if (char.lastDuration < 1000) {
        durationStr = ` (${char.lastDuration}ms)`;
      } else {
        durationStr = ` (${(char.lastDuration / 1000).toFixed(1)}s)`;
      }
    }

    // Build display text based on context
    let primaryText = '';
    let secondaryText: string | null = null;
    let tertiaryText: string | null = null;

    if (isStuck) {
      primaryText = "Hey! I'm stuck!";
    } else if (char.skillName) {
      // Show skill information prominently
      primaryText = `/${char.skillName}` + durationStr;
      secondaryText = char.toolInput || char.skillCommand || null;
      if (char.currentCommand && char.currentCommand !== 'Skill') {
        tertiaryText = char.currentCommand;
      }
    } else if (char.mcpServer) {
      // Show MCP server and tool
      primaryText = `MCP: ${char.mcpServer}` + durationStr;
      secondaryText = char.mcpTool || char.toolInput || null;
    } else {
      primaryText = char.currentCommand! + durationStr;
      secondaryText = char.toolInput || null;
    }

    ctx.font = 'bold 10px monospace';
    const primaryWidth = ctx.measureText(primaryText).width;
    ctx.font = '9px monospace';
    const secondaryWidth = secondaryText ? ctx.measureText(secondaryText).width : 0;
    const tertiaryWidth = tertiaryText ? ctx.measureText(tertiaryText).width : 0;

    const bubblePadX = 8;
    const bubbleW = Math.max(primaryWidth, secondaryWidth, tertiaryWidth) + bubblePadX * 2;

    // Calculate height based on number of lines
    const lineCount = 1 + (secondaryText ? 1 : 0) + (tertiaryText ? 1 : 0);
    const bubbleH = 10 + lineCount * 10;

    const bubbleX = cx - bubbleW / 2;
    const bubbleY = cy - (85 + (lineCount - 1) * 5) - jumpOffset;
    const tailSize = 6;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.roundRect(bubbleX + 2, bubbleY + 2, bubbleW, bubbleH, 6);
    ctx.fill();

    // Bubble
    ctx.fillStyle = bubbleColor;
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 6);
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = isStuck ? 2 : 1.5;
    ctx.stroke();

    // Tail
    ctx.fillStyle = bubbleColor;
    ctx.beginPath();
    ctx.moveTo(cx - tailSize / 2, bubbleY + bubbleH);
    ctx.lineTo(cx, bubbleY + bubbleH + tailSize);
    ctx.lineTo(cx + tailSize / 2, bubbleY + bubbleH);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(cx - tailSize / 2, bubbleY + bubbleH);
    ctx.lineTo(cx, bubbleY + bubbleH + tailSize);
    ctx.lineTo(cx + tailSize / 2, bubbleY + bubbleH);
    ctx.stroke();

    // Cover tail join
    ctx.fillStyle = bubbleColor;
    ctx.fillRect(cx - tailSize / 2 + 1, bubbleY + bubbleH - 1, tailSize - 2, 2);

    // Primary text (tool name, skill, or MCP)
    let yOffset = 11;
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(primaryText, cx, bubbleY + yOffset);

    // Secondary text (tool input) if present
    if (secondaryText) {
      yOffset += 10;
      ctx.font = '9px monospace';
      ctx.fillStyle = secondaryColor;
      ctx.fillText(secondaryText, cx, bubbleY + yOffset);
    }

    // Tertiary text (underlying tool for skills)
    if (tertiaryText) {
      yOffset += 10;
      ctx.font = '8px monospace';
      ctx.fillStyle = '#888888';
      ctx.fillText(`via ${tertiaryText}`, cx, bubbleY + yOffset);
    }
  }
};
