// Outdoor environment drawing - rooftop terrace with planters and string lights
import { TILE_SIZE } from './types';
import { PALETTE } from './palette';
import { seededRandom, getShadowOffset } from './utils';
import { drawDeckingTile, drawPlanterTile, drawConcreteEdge } from './tiles';

type PlanterType = 'tall' | 'medium' | 'small' | 'hanging';

// Draw planter with type, sway animation, and shading
const drawPlanter = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  type: PlanterType,
  seed: number,
  frame: number
) => {
  const swayPhase = (frame * 0.003 + seed * 0.5) % (Math.PI * 2);
  const swayAngle = Math.sin(swayPhase) * 0.008;

  const plantColors = {
    tall: { darkest: '#2E7D32', dark: '#388E3C', base: '#4CAF50', highlight: '#81C784' },
    medium: { darkest: '#1B5E20', dark: '#2E7D32', base: '#43A047', highlight: '#66BB6A' },
    small: { darkest: '#33691E', dark: '#558B2F', base: '#689F38', highlight: '#8BC34A' },
    hanging: { darkest: '#2E7D32', dark: '#388E3C', base: '#4CAF50', highlight: '#81C784' },
  };
  const colors = plantColors[type];

  if (type === 'tall') {
    const shadowDrift = getShadowOffset(frame);
    ctx.fillStyle = 'rgba(50, 50, 60, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x + 14 + shadowDrift.x, y + 44 + shadowDrift.y, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Modern white planter
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 4, y + 26, 20, 18);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(x + 2, y + 24, 24, 4);
    ctx.fillStyle = '#E8E8E8';
    ctx.fillRect(x + 4, y + 40, 20, 4);

    ctx.save();
    ctx.translate(x + 14, y + 28);
    ctx.rotate(swayAngle);

    // Foliage
    ctx.fillStyle = colors.darkest;
    ctx.beginPath();
    ctx.ellipse(0, -14, 16, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.dark;
    ctx.beginPath();
    ctx.ellipse(-2, -16, 14, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.base;
    ctx.beginPath();
    ctx.ellipse(-1, -17, 12, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.highlight;
    ctx.beginPath();
    ctx.ellipse(-4, -20, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

  } else if (type === 'medium') {
    const shadowDrift = getShadowOffset(frame);
    ctx.fillStyle = 'rgba(50, 50, 60, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 10 + shadowDrift.x, y + 28 + shadowDrift.y, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Terracotta style planter (orange accent)
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(x + 2, y + 14, 16, 14);
    ctx.fillStyle = '#FF8B5A';
    ctx.fillRect(x, y + 12, 20, 4);
    ctx.fillStyle = '#E85A28';
    ctx.fillRect(x + 2, y + 24, 16, 4);

    ctx.save();
    ctx.translate(x + 10, y + 14);
    ctx.rotate(swayAngle);

    ctx.fillStyle = colors.darkest;
    ctx.beginPath();
    ctx.ellipse(0, -8, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.base;
    ctx.beginPath();
    ctx.ellipse(-1, -10, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.highlight;
    ctx.beginPath();
    ctx.ellipse(-2, -12, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

  } else if (type === 'small') {
    const shadowDrift = getShadowOffset(frame);
    ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
    ctx.beginPath();
    ctx.ellipse(x + 6 + shadowDrift.x, y + 16 + shadowDrift.y, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Small concrete planter (gray)
    ctx.fillStyle = '#A8B8C8';
    ctx.fillRect(x + 2, y + 8, 8, 8);
    ctx.fillStyle = '#C8D8E8';
    ctx.fillRect(x + 1, y + 6, 10, 3);

    ctx.save();
    ctx.translate(x + 6, y + 8);
    ctx.rotate(swayAngle * 0.5);

    ctx.fillStyle = colors.darkest;
    ctx.beginPath();
    ctx.ellipse(0, -4, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.base;
    ctx.beginPath();
    ctx.ellipse(-1, -5, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

  } else if (type === 'hanging') {
    // Macrame hanger
    ctx.strokeStyle = '#D4C4A8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 10);
    ctx.lineTo(x + 8, y + 4);
    ctx.stroke();
    ctx.lineWidth = 1;

    // Hanging pot
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 2, y + 4, 12, 10);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(x + 1, y + 2, 14, 3);

    // Trailing plant
    ctx.fillStyle = colors.base;
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 2, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Trailing vines
    ctx.fillStyle = colors.dark;
    ctx.fillRect(x + 3, y + 10, 2, 8);
    ctx.fillRect(x + 10, y + 12, 2, 6);
    ctx.fillStyle = colors.highlight;
    ctx.fillRect(x + 6, y + 8, 2, 10);
  }
};

// Draw string lights
const drawStringLights = (
  ctx: CanvasRenderingContext2D,
  startX: number, startY: number,
  endX: number, endY: number,
  frame: number,
  seed: number
) => {
  // String/wire
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, startY);

  // Create a slight sag
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 + 8;
  ctx.quadraticCurveTo(midX, midY, endX, endY);
  ctx.stroke();

  // Bulbs along the string
  const lightColors = ['#FFD166', '#FF6B35', '#2EC4B6', '#9B5DE5', '#4CAF50'];
  const numLights = 5;
  for (let i = 0; i < numLights; i++) {
    const t = (i + 0.5) / numLights;
    const x = startX + (endX - startX) * t;
    const sagAmount = Math.sin(t * Math.PI) * 8;
    const y = startY + (endY - startY) * t + sagAmount;

    const color = lightColors[(i + Math.floor(seed)) % lightColors.length];
    const twinkle = ((frame * 0.05 + i * 0.3 + seed) % 1) > 0.85 ? 1.3 : 1;

    // Glow
    ctx.fillStyle = `${color}40`;
    ctx.beginPath();
    ctx.arc(x, y, 4 * twinkle, 0, Math.PI * 2);
    ctx.fill();

    // Bulb
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
};

// Draw bicycle rack with bikes
const drawBicycleRack = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  frame: number
) => {
  // Rack frame
  ctx.fillStyle = '#505050';
  ctx.fillRect(x, y + 20, 40, 3);
  ctx.fillStyle = '#606060';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(x + 5 + i * 10, y + 10, 2, 12);
  }

  // Bike 1 (teal)
  const bike1X = x + 6;
  const bike1Y = y + 2;
  // Wheels
  ctx.strokeStyle = '#303030';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(bike1X, bike1Y + 14, 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bike1X + 16, bike1Y + 14, 6, 0, Math.PI * 2);
  ctx.stroke();
  // Frame
  ctx.strokeStyle = '#2EC4B6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bike1X, bike1Y + 14);
  ctx.lineTo(bike1X + 8, bike1Y + 8);
  ctx.lineTo(bike1X + 16, bike1Y + 14);
  ctx.moveTo(bike1X + 8, bike1Y + 8);
  ctx.lineTo(bike1X + 8, bike1Y + 2);
  ctx.stroke();
  ctx.lineWidth = 1;
  // Handlebars
  ctx.fillStyle = '#404040';
  ctx.fillRect(bike1X + 6, bike1Y, 4, 2);

  // Bike 2 (orange)
  const bike2X = x + 26;
  const bike2Y = y + 4;
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(bike2X, bike2Y + 12, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bike2X + 14, bike2Y + 12, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#FF6B35';
  ctx.beginPath();
  ctx.moveTo(bike2X, bike2Y + 12);
  ctx.lineTo(bike2X + 7, bike2Y + 6);
  ctx.lineTo(bike2X + 14, bike2Y + 12);
  ctx.moveTo(bike2X + 7, bike2Y + 6);
  ctx.lineTo(bike2X + 7, bike2Y);
  ctx.stroke();
  ctx.lineWidth = 1;
};

// Draw outdoor table with umbrella
const drawOutdoorTable = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  umbrellaColor: string,
  frame: number
) => {
  // Table shadow
  ctx.fillStyle = 'rgba(50, 50, 60, 0.2)';
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 30, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Table leg
  ctx.fillStyle = '#505050';
  ctx.fillRect(x + 10, y + 16, 4, 14);

  // Table top
  ctx.fillStyle = '#A08060';
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 16, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#B09070';
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 14, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Umbrella pole
  ctx.fillStyle = '#606060';
  ctx.fillRect(x + 11, y - 20, 2, 34);

  // Umbrella canopy
  ctx.fillStyle = umbrellaColor;
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 22);
  ctx.lineTo(x - 8, y - 4);
  ctx.lineTo(x + 32, y - 4);
  ctx.closePath();
  ctx.fill();

  // Umbrella stripes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 22);
  ctx.lineTo(x + 2, y - 4);
  ctx.lineTo(x + 12, y - 4);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 22);
  ctx.lineTo(x + 22, y - 4);
  ctx.lineTo(x + 32, y - 4);
  ctx.closePath();
  ctx.fill();
};

// Draw the outdoor environment
export const drawOutdoor = (
  ctx: CanvasRenderingContext2D,
  buildingX: number, buildingY: number,
  buildingW: number, buildingH: number,
  frame: number
) => {
  const borderSize = 4;
  const terraceWidth = 6;

  const startX = buildingX - borderSize * TILE_SIZE;
  const startY = buildingY - borderSize * TILE_SIZE;
  const totalW = buildingW + (borderSize * 2 + terraceWidth) * TILE_SIZE;
  const totalH = buildingH + borderSize * 2 * TILE_SIZE;

  // Draw decking and planters
  for (let ty = 0; ty < Math.ceil(totalH / TILE_SIZE) + 2; ty++) {
    for (let tx = 0; tx < Math.ceil(totalW / TILE_SIZE) + 2; tx++) {
      const px = startX + tx * TILE_SIZE;
      const py = startY + ty * TILE_SIZE;
      const seed = tx * 127 + ty * 311;

      const isTerraceZone = px >= buildingX + buildingW + borderSize * TILE_SIZE;
      const isInsideBuilding = px >= buildingX && px < buildingX + buildingW &&
                               py >= buildingY && py < buildingY + buildingH;
      const isEdgeZone = !isInsideBuilding && !isTerraceZone;

      if (isTerraceZone) {
        // Wood decking for terrace
        drawDeckingTile(ctx, px, py, seed, frame);
      } else if (isEdgeZone) {
        // Concrete edge around building
        drawConcreteEdge(ctx, px, py, seed);
      }
    }
  }

  // Draw planters
  const planterPositions: Array<{ x: number; y: number; type: PlanterType; seed: number }> = [
    { x: startX + TILE_SIZE * 0.5, y: startY + TILE_SIZE * 1, type: 'tall', seed: 1 },
    { x: startX + TILE_SIZE * 2, y: startY + totalH - TILE_SIZE * 3.5, type: 'medium', seed: 2 },
    { x: buildingX + buildingW + TILE_SIZE * 0.5, y: startY + TILE_SIZE * 2, type: 'tall', seed: 3 },
    { x: startX + TILE_SIZE * 0.5, y: startY + totalH - TILE_SIZE * 2, type: 'small', seed: 4 },
    { x: buildingX + buildingW + TILE_SIZE * 2.5, y: startY + totalH - TILE_SIZE * 3, type: 'medium', seed: 5 },
    { x: startX + TILE_SIZE * 1, y: startY + TILE_SIZE * 4, type: 'small', seed: 6 },
  ];

  planterPositions.forEach(pos => drawPlanter(ctx, pos.x, pos.y, pos.type, pos.seed, frame));

  // Draw string lights
  const lightsY = startY + TILE_SIZE;
  drawStringLights(ctx, startX + TILE_SIZE, lightsY, startX + TILE_SIZE * 3.5, lightsY + 4, frame, 1);
  drawStringLights(ctx, buildingX + buildingW + TILE_SIZE, lightsY, buildingX + buildingW + TILE_SIZE * 4, lightsY + 6, frame, 2);
  drawStringLights(ctx, startX + TILE_SIZE * 0.5, startY + totalH - TILE_SIZE * 1.5, startX + TILE_SIZE * 3, startY + totalH - TILE_SIZE * 1.2, frame, 3);

  // Draw outdoor furniture on terrace
  const terraceX = buildingX + buildingW + borderSize * TILE_SIZE + TILE_SIZE;
  drawOutdoorTable(ctx, terraceX + TILE_SIZE, startY + TILE_SIZE * 4, '#FF6B35', frame);
  drawOutdoorTable(ctx, terraceX + TILE_SIZE * 3, startY + totalH - TILE_SIZE * 5, '#2EC4B6', frame);

  // Draw bicycle rack
  drawBicycleRack(ctx, startX + TILE_SIZE * 0.5, startY + totalH - TILE_SIZE * 5.5, frame);

  // Entrance path with modern tiles
  const pathCenterX = buildingX + buildingW / 2;
  const pathWidth = 3;
  const pathStartY = buildingY + buildingH;
  const pathEndY = startY + totalH;

  for (let py = pathStartY; py < pathEndY; py += TILE_SIZE) {
    for (let px = 0; px < pathWidth; px++) {
      const tileX = pathCenterX - (pathWidth * TILE_SIZE) / 2 + px * TILE_SIZE;
      const seed = px * 127 + py * 311;
      drawPlanterTile(ctx, tileX, py, seed);
    }
  }

  // Modern welcome mat
  const matX = pathCenterX - TILE_SIZE * 1.5;
  const matY = buildingY + buildingH + TILE_SIZE * 0.3;
  drawModernWelcomeMat(ctx, matX, matY);

  // Main entrance
  drawModernEntrance(ctx, pathCenterX, buildingY + buildingH);

  // Mural/graffiti art on side wall
  drawMuralArt(ctx, startX + TILE_SIZE * 0.5, startY + TILE_SIZE * 6, frame);
};

// Draw modern welcome mat
const drawModernWelcomeMat = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number
) => {
  const matW = TILE_SIZE * 3;
  const matH = TILE_SIZE * 1.5;

  ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
  ctx.fillRect(x + 2, y + 2, matW, matH);

  // Dark gray modern mat
  ctx.fillStyle = '#404040';
  ctx.fillRect(x, y, matW, matH);

  ctx.fillStyle = '#505050';
  ctx.fillRect(x, y, matW, 2);
  ctx.fillRect(x, y, 2, matH);
  ctx.fillStyle = '#303030';
  ctx.fillRect(x, y + matH - 2, matW, 2);
  ctx.fillRect(x + matW - 2, y, 2, matH);

  // Teal accent stripe
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(x + matW/2 - 12, y + matH/2 - 2, 24, 4);
};

// Draw modern entrance
const drawModernEntrance = (ctx: CanvasRenderingContext2D, pathCenterX: number, buildingBottomY: number) => {
  const entranceX = pathCenterX - TILE_SIZE * 2.5;
  const entranceY = buildingBottomY + TILE_SIZE * 2;

  // Modern overhang (clean lines)
  ctx.fillStyle = '#404040';
  ctx.fillRect(entranceX - 20, entranceY - 28, TILE_SIZE * 5 + 40, 10);
  ctx.fillStyle = '#505050';
  ctx.fillRect(entranceX - 20, entranceY - 28, TILE_SIZE * 5 + 40, 3);

  // LED strip under overhang
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(entranceX - 15, entranceY - 19, TILE_SIZE * 5 + 30, 2);

  // Entrance frame (white/glass)
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(entranceX - 10, entranceY - 45, TILE_SIZE * 5 + 20, 50);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(entranceX - 8, entranceY - 43, TILE_SIZE * 5 + 16, 46);

  // Glass doors
  const doorWidth = (TILE_SIZE * 5 - 8) / 2;

  // Left door (glass)
  ctx.fillStyle = '#A8D0E8';
  ctx.fillRect(entranceX, entranceY - 38, doorWidth, 40);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(entranceX + 4, entranceY - 34, doorWidth - 8, 32);
  // Door handle
  ctx.fillStyle = '#505050';
  ctx.fillRect(entranceX + doorWidth - 8, entranceY - 20, 4, 12);

  // Right door (glass)
  ctx.fillStyle = '#A8D0E8';
  ctx.fillRect(entranceX + doorWidth + 4, entranceY - 38, doorWidth, 40);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(entranceX + doorWidth + 8, entranceY - 34, doorWidth - 8, 32);
  // Door handle
  ctx.fillStyle = '#505050';
  ctx.fillRect(entranceX + doorWidth + 8, entranceY - 20, 4, 12);

  // Logo/sign above entrance
  ctx.fillStyle = '#303030';
  ctx.fillRect(entranceX + TILE_SIZE * 1, entranceY - 54, TILE_SIZE * 3, 14);
  ctx.fillStyle = '#2EC4B6';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CODEMAP', entranceX + TILE_SIZE * 2.5, entranceY - 44);
  ctx.textAlign = 'left';

  // Potted plants by entrance
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(entranceX - 18, entranceY - 8, 14, 12);
  ctx.fillRect(entranceX + TILE_SIZE * 5 + 4, entranceY - 8, 14, 12);
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.ellipse(entranceX - 11, entranceY - 14, 8, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(entranceX + TILE_SIZE * 5 + 11, entranceY - 14, 8, 8, 0, 0, Math.PI * 2);
  ctx.fill();
};

// Draw colorful mural/graffiti art
const drawMuralArt = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  frame: number
) => {
  // Wall background for mural
  ctx.fillStyle = '#E8E8E8';
  ctx.fillRect(x, y, TILE_SIZE * 2.5, TILE_SIZE * 3);

  // Abstract geometric shapes (coworking/creative vibe)
  ctx.fillStyle = '#FF6B35';
  ctx.beginPath();
  ctx.arc(x + 12, y + 15, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(x + 22, y + 8, 14, 14);

  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 30);
  ctx.lineTo(x + 20, y + 30);
  ctx.lineTo(x + 14, y + 42);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#9B5DE5';
  ctx.beginPath();
  ctx.arc(x + 30, y + 35, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(x + 4, y + 38, 10, 8);

  // Outline
  ctx.strokeStyle = '#303030';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, TILE_SIZE * 2.5, TILE_SIZE * 3);
};
