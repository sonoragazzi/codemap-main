// Tile drawing functions for outdoor environment
// Used for rooftop terrace around the coworking space
import { TILE_SIZE } from './types';
import { PALETTE } from './palette';
import { seededRandom, adjustBrightness } from './utils';

// Draw wood decking tile for terrace
export const drawDeckingTile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number,
  frame: number
) => {
  const colors = PALETTE.decking;
  const roll = seededRandom(seed);

  let variant: number;
  if (roll < 0.60) variant = 1;      // Standard decking (60%)
  else if (roll < 0.80) variant = 2; // Lighter plank (20%)
  else if (roll < 0.95) variant = 3; // Darker plank (15%)
  else variant = 4;                  // Weathered (5%)

  let baseColor = colors.base;
  if (variant === 2) baseColor = colors.light;
  else if (variant === 3) baseColor = colors.dark;
  else if (variant === 4) baseColor = adjustBrightness(colors.base, -0.1);

  // Base plank color
  ctx.fillStyle = baseColor;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // Plank lines (horizontal for decking)
  ctx.fillStyle = colors.gap;
  ctx.fillRect(x, y, TILE_SIZE, 1);
  ctx.fillRect(x, y + TILE_SIZE / 2, TILE_SIZE, 1);

  // Wood grain highlights
  ctx.fillStyle = colors.light;
  ctx.globalAlpha = 0.3;
  if (seededRandom(seed + 1) > 0.5) {
    ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, 1);
  }
  if (seededRandom(seed + 2) > 0.5) {
    ctx.fillRect(x + 3, y + TILE_SIZE / 2 + 2, TILE_SIZE - 6, 1);
  }
  ctx.globalAlpha = 1;

  // Wood grain shadows
  ctx.fillStyle = colors.dark;
  ctx.globalAlpha = 0.2;
  if (seededRandom(seed + 3) > 0.6) {
    ctx.fillRect(x + 1, y + 5, TILE_SIZE - 2, 1);
  }
  if (seededRandom(seed + 4) > 0.6) {
    ctx.fillRect(x + 2, y + TILE_SIZE / 2 + 5, TILE_SIZE - 4, 1);
  }
  ctx.globalAlpha = 1;

  // Occasional knot
  if (variant === 4 && seededRandom(seed + 10) > 0.7) {
    ctx.fillStyle = colors.gap;
    ctx.beginPath();
    ctx.arc(x + 6 + seededRandom(seed + 11) * 4, y + 4 + seededRandom(seed + 12) * 4, 2, 0, Math.PI * 2);
    ctx.fill();
  }
};

// Draw concrete/paver tile for paths
export const drawPlanterTile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number
) => {
  // Modern gray concrete pavers
  ctx.fillStyle = '#C8C8C8';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  const stonePositions = [
    { sx: 1, sy: 1, sw: 6, sh: 6 },
    { sx: 8, sy: 1, sw: 7, sh: 5 },
    { sx: 1, sy: 8, sw: 5, sh: 7 },
    { sx: 7, sy: 7, sw: 8, sh: 8 },
  ];

  stonePositions.forEach((stone, i) => {
    const variation = seededRandom(seed + i * 17) * 0.08 - 0.04;
    const stoneColor = adjustBrightness('#D8D8D8', variation);
    ctx.fillStyle = stoneColor;
    ctx.fillRect(x + stone.sx, y + stone.sy, stone.sw, stone.sh);
    ctx.fillStyle = adjustBrightness(stoneColor, 0.08);
    ctx.fillRect(x + stone.sx, y + stone.sy, stone.sw, 1);
    ctx.fillRect(x + stone.sx, y + stone.sy, 1, stone.sh);
    ctx.fillStyle = adjustBrightness(stoneColor, -0.08);
    ctx.fillRect(x + stone.sx, y + stone.sy + stone.sh - 1, stone.sw, 1);
    ctx.fillRect(x + stone.sx + stone.sw - 1, y + stone.sy, 1, stone.sh);
  });

  // Grout lines
  ctx.fillStyle = '#A8A8A8';
  ctx.fillRect(x + 7, y, 1, TILE_SIZE);
  ctx.fillRect(x, y + 7, TILE_SIZE, 1);
};

// Draw concrete edge around building
export const drawConcreteEdge = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number
) => {
  const variation = seededRandom(seed) * 0.06 - 0.03;
  const baseColor = adjustBrightness('#D0D0D0', variation);

  ctx.fillStyle = baseColor;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // Subtle texture
  ctx.fillStyle = adjustBrightness(baseColor, 0.05);
  ctx.globalAlpha = 0.5;
  if (seededRandom(seed + 1) > 0.6) {
    ctx.fillRect(x + 2, y + 2, 4, 4);
  }
  if (seededRandom(seed + 2) > 0.6) {
    ctx.fillRect(x + 9, y + 8, 5, 5);
  }
  ctx.globalAlpha = 1;

  // Edge highlight
  ctx.fillStyle = adjustBrightness(baseColor, 0.1);
  ctx.fillRect(x, y, TILE_SIZE, 1);
  ctx.fillRect(x, y, 1, TILE_SIZE);

  // Edge shadow
  ctx.fillStyle = adjustBrightness(baseColor, -0.08);
  ctx.fillRect(x, y + TILE_SIZE - 1, TILE_SIZE, 1);
  ctx.fillRect(x + TILE_SIZE - 1, y, 1, TILE_SIZE);
};

// Draw grass tile with variants and animation (kept for compatibility)
export const drawGrassTile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number,
  frame: number
) => {
  const colors = PALETTE.grass;
  const roll = seededRandom(seed);

  let variant: number;
  if (roll < 0.55) variant = 1;      // Plain grass (55%)
  else if (roll < 0.72) variant = 2; // Light grass (17%)
  else if (roll < 0.85) variant = 3; // Dark grass (13%)
  else if (roll < 0.94) variant = 4; // Flower (9%)
  else if (roll < 0.97) variant = 5; // Mushroom (3%)
  else variant = 6;                  // Rock (3%)

  // PERFORMANCE: Only animate 25% of tiles
  const shouldAnimate = (seed % 4) === 0;
  const slowFrame = Math.floor(frame / 3);
  const tilePhaseOffset = seededRandom(seed) * Math.PI * 2;
  const swayPhase = shouldAnimate ? (slowFrame * 0.08 + tilePhaseOffset) % (Math.PI * 2) : tilePhaseOffset;
  const swayOffset = Math.sin(swayPhase) * 1.5;

  let baseColor = colors.base;
  if (variant === 2) baseColor = colors.light;
  else if (variant === 3) baseColor = colors.dark;

  ctx.fillStyle = baseColor;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // Grass tufts (simplified)
  ctx.fillStyle = colors.darkest;
  ctx.globalAlpha = 0.45;

  if (seededRandom(seed + 1) > 0.5) {
    ctx.fillRect(x + 2 + swayOffset, y + 4, 2, 7);
  }
  if (seededRandom(seed + 2) > 0.5) {
    ctx.fillRect(x + 11 + swayOffset, y + 3, 2, 8);
  }
  ctx.globalAlpha = 1;

  // Light highlights
  ctx.fillStyle = colors.light;
  ctx.globalAlpha = 0.5;
  if (seededRandom(seed + 4) > 0.45) ctx.fillRect(x + 4, y, 5, 4);
  if (seededRandom(seed + 5) > 0.55) ctx.fillRect(x + 8, y + 9, 5, 4);
  ctx.globalAlpha = 1;

  // Flower variant
  if (variant === 4) {
    const flowerColors = ['#FF6B35', '#FFD166', '#2EC4B6'];
    const fc = flowerColors[Math.floor(seededRandom(seed + 10) * flowerColors.length)];
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(x + 6, y + 6, 2, 8);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(x + 3, y + 8, 4, 2);
    ctx.fillRect(x + 7, y + 9, 4, 2);
    ctx.fillStyle = fc;
    ctx.fillRect(x + 4, y, 7, 7);
    ctx.fillStyle = '#FFE088';
    ctx.fillRect(x + 5, y + 1, 5, 5);
    ctx.fillStyle = '#E85A28';
    ctx.fillRect(x + 6, y + 2, 3, 3);
  }

  // Mushroom variant
  if (variant === 5) {
    ctx.fillStyle = 'rgba(40, 30, 20, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 14, 6, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F8F0E8';
    ctx.fillRect(x + 5, y + 7, 5, 7);
    ctx.fillStyle = '#E8E0D8';
    ctx.fillRect(x + 9, y + 7, 1, 7);
    ctx.fillStyle = '#D83020';
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 5, 7, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F04030';
    ctx.fillRect(x + 3, y + 2, 6, 3);
    ctx.fillStyle = '#FFF8F0';
    ctx.fillRect(x + 4, y + 2, 3, 3);
    ctx.fillRect(x + 9, y + 3, 3, 3);
    ctx.fillRect(x + 6, y + 6, 2, 2);
  }

  // Rock variant
  if (variant === 6) {
    ctx.fillStyle = 'rgba(60, 50, 40, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 14, 7, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#807870';
    ctx.fillRect(x + 1, y + 4, 14, 9);
    ctx.fillRect(x + 2, y + 3, 12, 10);
    ctx.fillStyle = '#A8A098';
    ctx.fillRect(x + 2, y + 3, 9, 3);
    ctx.fillRect(x + 1, y + 4, 3, 6);
    ctx.fillStyle = '#585850';
    ctx.fillRect(x + 4, y + 11, 10, 2);
    ctx.fillRect(x + 12, y + 6, 3, 6);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(x + 4, y + 7, 4, 3);
  }
};

// Draw water tile with waves (kept for compatibility)
export const drawWaterTile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number,
  frame: number
) => {
  const colors = PALETTE.water;
  const slowFrame = Math.floor(frame / 2);

  ctx.fillStyle = colors.deep;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  const waveOffset = Math.sin((slowFrame * 0.04) + seed * 0.1) * 2;
  ctx.fillStyle = colors.mid;
  ctx.fillRect(x, y + 4 + waveOffset, TILE_SIZE, 4);
  ctx.fillStyle = colors.light;
  ctx.fillRect(x, y + 10 + waveOffset * 0.7, TILE_SIZE, 3);

  if (seededRandom(seed + 20) > 0.95) {
    const sparkleVisible = Math.sin(slowFrame * 0.08 + seed) > 0.8;
    if (sparkleVisible) {
      ctx.fillStyle = colors.highlight;
      ctx.fillRect(x + 5 + seededRandom(seed + 21) * 6, y + 3 + seededRandom(seed + 22) * 8, 2, 2);
    }
  }
};

// Draw cobblestone path tile (kept for compatibility)
export const drawPathTile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number
) => {
  ctx.fillStyle = '#B8A898';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  const stonePositions = [
    { sx: 1, sy: 1, sw: 6, sh: 6 },
    { sx: 8, sy: 1, sw: 7, sh: 5 },
    { sx: 1, sy: 8, sw: 5, sh: 7 },
    { sx: 7, sy: 7, sw: 8, sh: 8 },
  ];

  stonePositions.forEach((stone, i) => {
    const variation = seededRandom(seed + i * 17) * 0.1 - 0.05;
    const stoneColor = adjustBrightness('#C8B8A8', variation);
    ctx.fillStyle = stoneColor;
    ctx.fillRect(x + stone.sx, y + stone.sy, stone.sw, stone.sh);
    ctx.fillStyle = adjustBrightness(stoneColor, 0.12);
    ctx.fillRect(x + stone.sx, y + stone.sy, stone.sw, 1);
    ctx.fillRect(x + stone.sx, y + stone.sy, 1, stone.sh);
    ctx.fillStyle = adjustBrightness(stoneColor, -0.1);
    ctx.fillRect(x + stone.sx, y + stone.sy + stone.sh - 1, stone.sw, 1);
    ctx.fillRect(x + stone.sx + stone.sw - 1, y + stone.sy, 1, stone.sh);
  });

  ctx.fillStyle = '#988878';
  ctx.fillRect(x + 7, y, 1, TILE_SIZE);
  ctx.fillRect(x, y + 7, TILE_SIZE, 1);
};

// Draw welcome mat at entrance (kept for compatibility)
export const drawWelcomeMat = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  const matW = TILE_SIZE * 3;
  const matH = TILE_SIZE * 1.5;

  ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
  ctx.fillRect(x + 2, y + 2, matW, matH);

  // Modern dark gray mat
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
  ctx.fillRect(x + matW/2 - 10, y + matH/2 - 2, 20, 4);
};
