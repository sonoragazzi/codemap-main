// Room-themed decorations based on folder names - Coworking Creative Space
import { TILE_SIZE, RoomLayout } from './types';
import { seededRandom, adjustBrightness } from './utils';

// Draw room-specific themed decorations based on folder name
export const drawRoomThemedDecorations = (ctx: CanvasRenderingContext2D, room: RoomLayout, frame: number) => {
  const px = room.x * TILE_SIZE;
  const py = room.y * TILE_SIZE;
  const w = room.width * TILE_SIZE;
  const h = room.height * TILE_SIZE;
  const name = room.name.toLowerCase();

  // ROOT/WELCOME AREA THEME
  if (room.depth === 0 || name.includes('codemap')) {
    drawWelcomeAreaDecorations(ctx, px, py, w, h, room, frame);
  }

  // CLIENT FOLDER THEME - Meeting Room
  if (name.includes('client')) {
    drawMeetingRoomDecorations(ctx, px, py, w, h, frame);
  }

  // SERVER FOLDER THEME - Tech Corner
  if (name.includes('server')) {
    drawTechCornerDecorations(ctx, px, py, w, h, frame);
  }

  // HOOKS FOLDER THEME - Maker Space
  if (name.includes('hook')) {
    drawMakerSpaceDecorations(ctx, px, py, w, h, frame);
  }

  // COMPONENTS FOLDER THEME - Creative Hub
  if (name.includes('component')) {
    drawCreativeHubDecorations(ctx, px, py, w, h, frame);
  }

  // SRC FOLDER - Hot Desk Area
  if (name === 'src') {
    drawHotDeskDecorations(ctx, px, py, w, h, frame);
  }

  // UTILS/TYPES folders - Quiet Zone
  if (name.includes('util') || name.includes('type') || name.includes('style')) {
    drawQuietZoneDecorations(ctx, px, py, w, h, frame);
  }
};

const drawWelcomeAreaDecorations = (
  ctx: CanvasRenderingContext2D,
  px: number, py: number, w: number, h: number,
  room: RoomLayout, frame: number
) => {
  // Modern sofa (teal)
  const sofaX = px + 15;
  const sofaY = py + 15;
  ctx.fillStyle = 'rgba(46, 196, 182, 0.2)';
  ctx.fillRect(sofaX + 2, sofaY + 18, 40, 4);
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(sofaX, sofaY + 4, 40, 16);
  ctx.fillStyle = '#5DD9CD';
  ctx.fillRect(sofaX, sofaY + 4, 40, 3);
  ctx.fillStyle = '#26A89C';
  ctx.fillRect(sofaX, sofaY + 17, 40, 3);
  // Cushions
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(sofaX + 4, sofaY + 8, 8, 6);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(sofaX + 28, sofaY + 8, 8, 6);
  // Sofa arms
  ctx.fillStyle = '#1E8C82';
  ctx.fillRect(sofaX - 2, sofaY + 4, 4, 14);
  ctx.fillRect(sofaX + 38, sofaY + 4, 4, 14);

  // Event board / community board
  const ebX = px + 70;
  const ebY = py + 8;
  ctx.fillStyle = '#404040';
  ctx.fillRect(ebX, ebY, 40, 26);
  ctx.fillStyle = '#505050';
  ctx.fillRect(ebX, ebY, 40, 3);
  // Cork board surface
  ctx.fillStyle = '#D4A574';
  ctx.fillRect(ebX + 2, ebY + 4, 36, 20);
  // Pinned items - post-its and flyers
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(ebX + 5, ebY + 6, 10, 8);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(ebX + 18, ebY + 8, 8, 10);
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(ebX + 28, ebY + 6, 8, 7);
  ctx.fillStyle = '#9B5DE5';
  ctx.fillRect(ebX + 8, ebY + 16, 12, 6);
  // Pins
  ctx.fillStyle = '#E8E8E8';
  ctx.fillRect(ebX + 9, ebY + 6, 2, 2);
  ctx.fillRect(ebX + 21, ebY + 8, 2, 2);
  ctx.fillRect(ebX + 31, ebY + 6, 2, 2);

  // Large indoor plant (fiddle leaf fig)
  const dpX = px + w - 40;
  const dpY = py + h - 60;
  ctx.fillStyle = 'rgba(40, 60, 30, 0.3)';
  ctx.beginPath();
  ctx.ellipse(dpX + 12, dpY + 40, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Modern white planter
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(dpX + 2, dpY + 24, 20, 16);
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(dpX, dpY + 22, 24, 4);
  // Plant foliage
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.ellipse(dpX + 12, dpY + 8, 18, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6EC071';
  ctx.beginPath();
  ctx.ellipse(dpX + 10, dpY + 4, 14, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#81C784';
  ctx.beginPath();
  ctx.ellipse(dpX + 14, dpY + 2, 10, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wall clock (modern minimal)
  const clkX = px + w / 2;
  const clkY = py + 8;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(clkX, clkY + 6, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.lineWidth = 1;
  // Clock hands
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(clkX, clkY + 6);
  ctx.lineTo(clkX + 3, clkY + 3);
  ctx.stroke();
  const minuteAngle = (frame * 0.001) % (Math.PI * 2);
  ctx.beginPath();
  ctx.moveTo(clkX, clkY + 6);
  ctx.lineTo(clkX + Math.sin(minuteAngle) * 5, clkY + 6 - Math.cos(minuteAngle) * 5);
  ctx.stroke();
  ctx.lineWidth = 1;

  // Geometric rug (colorful)
  const rugX = px + w / 2 - 35;
  const rugY = py + h / 2 - 18;
  ctx.fillStyle = '#F5F5F0';
  ctx.fillRect(rugX, rugY, 70, 36);
  // Geometric pattern
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(rugX + 5, rugY + 5, 20, 26);
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(rugX + 28, rugY + 5, 15, 13);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(rugX + 28, rugY + 20, 15, 11);
  ctx.fillStyle = '#9B5DE5';
  ctx.fillRect(rugX + 46, rugY + 5, 19, 26);

  // Welcome desk (modern reception)
  if (room.width >= 12) {
    const wdX = px + w - 70;
    const wdY = py + 15;
    ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
    ctx.fillRect(wdX + 2, wdY + 18, 50, 4);
    // White desk with orange accent
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(wdX, wdY, 50, 16);
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(wdX, wdY + 14, 50, 4);
    // Monitor on desk
    ctx.fillStyle = '#404040';
    ctx.fillRect(wdX + 10, wdY - 10, 20, 12);
    ctx.fillStyle = '#2EC4B6';
    ctx.fillRect(wdX + 12, wdY - 8, 16, 8);
    // Monitor stand
    ctx.fillStyle = '#505050';
    ctx.fillRect(wdX + 18, wdY + 2, 4, 4);
  }

  // Side table with plants
  const stX = px + 120;
  const stY = py + 10;
  if (w > 150) {
    ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
    ctx.fillRect(stX + 2, stY + 16, 14, 3);
    ctx.fillStyle = '#404040';
    ctx.fillRect(stX, stY + 8, 14, 10);
    ctx.fillStyle = '#505050';
    ctx.fillRect(stX - 1, stY + 6, 16, 3);
    // Small succulent
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(stX + 3, stY, 8, 6);
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(stX + 7, stY - 2, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawMeetingRoomDecorations = (
  ctx: CanvasRenderingContext2D,
  px: number, py: number, w: number, h: number, frame: number
) => {
  // Large whiteboard with content
  const wbX = px + 50;
  const wbY = py + 6;
  ctx.fillStyle = '#E8E8E8';
  ctx.fillRect(wbX - 2, wbY - 2, 50, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(wbX, wbY, 46, 24);
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 2;
  ctx.strokeRect(wbX, wbY, 46, 24);
  ctx.lineWidth = 1;
  // Whiteboard content - wireframes
  ctx.strokeStyle = '#2196F3';
  ctx.strokeRect(wbX + 4, wbY + 4, 16, 8);
  ctx.strokeRect(wbX + 24, wbY + 4, 16, 16);
  ctx.strokeStyle = '#FF6B35';
  ctx.strokeRect(wbX + 4, wbY + 14, 16, 8);
  // Markers tray
  ctx.fillStyle = '#D0D0D0';
  ctx.fillRect(wbX + 8, wbY + 22, 30, 4);

  // TV Monitor on wall
  const tvX = px + w - 55;
  const tvY = py + 8;
  ctx.fillStyle = '#303030';
  ctx.fillRect(tvX, tvY, 40, 24);
  ctx.fillStyle = '#404040';
  ctx.fillRect(tvX, tvY, 40, 2);
  // TV screen - presentation
  ctx.fillStyle = '#1E88E5';
  ctx.fillRect(tvX + 2, tvY + 3, 36, 19);
  // Slide content
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(tvX + 5, tvY + 6, 20, 3);
  ctx.fillStyle = '#90CAF9';
  ctx.fillRect(tvX + 5, tvY + 11, 14, 2);
  ctx.fillRect(tvX + 5, tvY + 15, 18, 2);
  // Animated indicator
  const indicatorOn = Math.floor(frame / 40) % 2 === 0;
  ctx.fillStyle = indicatorOn ? '#4CAF50' : '#2E7D32';
  ctx.fillRect(tvX + 34, tvY + 4, 3, 3);

  // Standing meeting table (high)
  const mtX = px + w - 100;
  const mtY = py + h - 45;
  ctx.fillStyle = 'rgba(50, 50, 60, 0.2)';
  ctx.fillRect(mtX + 4, mtY + 22, 40, 5);
  ctx.fillStyle = '#404040';
  ctx.fillRect(mtX + 16, mtY + 8, 8, 16);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(mtX, mtY, 40, 10);
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(mtX, mtY + 8, 40, 2);

  // Pouf/ottoman (orange)
  const poufX = px + 20;
  const poufY = py + h - 35;
  ctx.fillStyle = 'rgba(255, 107, 53, 0.2)';
  ctx.beginPath();
  ctx.ellipse(poufX + 10, poufY + 14, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF6B35';
  ctx.beginPath();
  ctx.ellipse(poufX + 10, poufY + 8, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF8B5A';
  ctx.beginPath();
  ctx.ellipse(poufX + 8, poufY + 4, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Second pouf (teal)
  const pouf2X = px + 45;
  const pouf2Y = py + h - 30;
  ctx.fillStyle = 'rgba(46, 196, 182, 0.2)';
  ctx.beginPath();
  ctx.ellipse(pouf2X + 10, pouf2Y + 14, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2EC4B6';
  ctx.beginPath();
  ctx.ellipse(pouf2X + 10, pouf2Y + 8, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5DD9CD';
  ctx.beginPath();
  ctx.ellipse(pouf2X + 8, pouf2Y + 4, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sticky notes cluster on wall
  const snX = px + 15;
  const snY = py + 10;
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(snX, snY, 12, 12);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(snX + 10, snY + 4, 12, 12);
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(snX + 5, snY + 12, 12, 12);
  ctx.fillStyle = '#9B5DE5';
  ctx.fillRect(snX + 18, snY + 14, 10, 10);
  // Scribbles
  ctx.fillStyle = '#404040';
  ctx.fillRect(snX + 2, snY + 4, 6, 1);
  ctx.fillRect(snX + 12, snY + 8, 6, 1);
  ctx.fillRect(snX + 7, snY + 16, 6, 1);
};

const drawTechCornerDecorations = (
  ctx: CanvasRenderingContext2D,
  px: number, py: number, w: number, h: number, frame: number
) => {
  // Server rack with RGB LED lights
  const srX = px + 20;
  const srY = py + 15;
  ctx.fillStyle = 'rgba(40, 30, 50, 0.3)';
  ctx.fillRect(srX + 3, srY + 30, 20, 4);
  ctx.fillStyle = '#303030';
  ctx.fillRect(srX, srY, 20, 28);
  ctx.fillStyle = '#404040';
  ctx.fillRect(srX, srY, 20, 3);
  ctx.fillStyle = '#252525';
  ctx.fillRect(srX, srY + 25, 20, 3);

  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#282828';
    ctx.fillRect(srX + 2, srY + 4 + i * 6, 16, 5);
    ctx.fillStyle = '#383838';
    ctx.fillRect(srX + 2, srY + 4 + i * 6, 16, 1);

    // RGB LED strips (animated colors)
    const hue = (frame * 0.5 + i * 30) % 360;
    const ledColor = `hsl(${hue}, 80%, 60%)`;
    ctx.fillStyle = ledColor;
    ctx.fillRect(srX + 14, srY + 5 + i * 6, 3, 2);

    // Activity lights
    const led1On = (frame + i * 17) % 24 < 14;
    ctx.fillStyle = led1On ? '#40FF40' : '#204020';
    ctx.fillRect(srX + 4, srY + 6 + i * 6, 1, 1);
  }

  // Network switch with blinking ports
  const nsX = px + 50;
  const nsY = py + 12;
  ctx.fillStyle = '#252525';
  ctx.fillRect(nsX, nsY, 30, 12);
  ctx.fillStyle = '#353535';
  ctx.fillRect(nsX, nsY, 30, 2);
  // Ports with activity
  for (let p = 0; p < 8; p++) {
    const portOn = (frame + p * 7) % 30 < 20;
    ctx.fillStyle = portOn ? '#4CAF50' : '#1B5E20';
    ctx.fillRect(nsX + 2 + p * 3.5, nsY + 5, 2, 4);
  }

  // Temperature/humidity monitor
  const tmX = px + 85;
  const tmY = py + 10;
  ctx.fillStyle = '#303030';
  ctx.fillRect(tmX, tmY, 20, 14);
  ctx.fillStyle = '#001820';
  ctx.fillRect(tmX + 2, tmY + 2, 16, 10);
  ctx.fillStyle = '#40FF90';
  ctx.font = '6px monospace';
  ctx.fillText('24°C', tmX + 3, tmY + 8);
  ctx.fillStyle = '#4080FF';
  ctx.fillText('45%', tmX + 4, tmY + 11);

  // UPS with status display
  const upsX = px + 50;
  const upsY = py + h - 35;
  ctx.fillStyle = 'rgba(40, 30, 50, 0.25)';
  ctx.fillRect(upsX + 2, upsY + 22, 30, 4);
  ctx.fillStyle = '#252525';
  ctx.fillRect(upsX, upsY, 30, 22);
  ctx.fillStyle = '#353535';
  ctx.fillRect(upsX, upsY, 30, 3);
  // Status screen
  ctx.fillStyle = '#001820';
  ctx.fillRect(upsX + 3, upsY + 5, 24, 10);
  ctx.fillStyle = '#40FF40';
  ctx.fillRect(upsX + 5, upsY + 7, 8, 6);
  ctx.fillStyle = '#60FF60';
  ctx.font = '5px monospace';
  ctx.fillText('100%', upsX + 14, upsY + 12);

  // Cooling fan unit
  const cfX = px + w - 50;
  const cfY = py + 20;
  ctx.fillStyle = '#404040';
  ctx.fillRect(cfX, cfY, 24, 24);
  ctx.fillStyle = '#505050';
  ctx.fillRect(cfX, cfY, 24, 3);
  // Fan grille
  ctx.fillStyle = '#252525';
  ctx.beginPath();
  ctx.arc(cfX + 12, cfY + 14, 9, 0, Math.PI * 2);
  ctx.fill();
  // Animated fan blades
  const fanAngle = (frame * 0.2) % (Math.PI * 2);
  ctx.fillStyle = '#606060';
  for (let blade = 0; blade < 4; blade++) {
    const bladeAngle = fanAngle + (blade * Math.PI / 2);
    ctx.save();
    ctx.translate(cfX + 12, cfY + 14);
    ctx.rotate(bladeAngle);
    ctx.fillRect(-2, -7, 4, 7);
    ctx.restore();
  }
  // RGB ring
  const ringHue = (frame * 0.3) % 360;
  ctx.strokeStyle = `hsl(${ringHue}, 80%, 50%)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cfX + 12, cfY + 14, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1;

  // Ethernet cables (colored)
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(srX + 20, srY + 8);
  ctx.lineTo(nsX, nsY + 8);
  ctx.stroke();
  ctx.strokeStyle = '#2EC4B6';
  ctx.beginPath();
  ctx.moveTo(srX + 20, srY + 14);
  ctx.lineTo(srX + 35, srY + 14);
  ctx.lineTo(srX + 35, nsY + 8);
  ctx.lineTo(nsX, nsY + 8);
  ctx.stroke();
  ctx.lineWidth = 1;
};

const drawMakerSpaceDecorations = (
  ctx: CanvasRenderingContext2D,
  px: number, py: number, w: number, h: number, frame: number
) => {
  // 3D Printer
  const prX = px + 20;
  const prY = py + 12;
  ctx.fillStyle = 'rgba(40, 40, 50, 0.2)';
  ctx.fillRect(prX + 2, prY + 28, 30, 4);
  ctx.fillStyle = '#404040';
  ctx.fillRect(prX, prY, 30, 28);
  ctx.fillStyle = '#505050';
  ctx.fillRect(prX, prY, 30, 3);
  // Print chamber (transparent)
  ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';
  ctx.fillRect(prX + 3, prY + 5, 24, 18);
  // Build plate
  ctx.fillStyle = '#606060';
  ctx.fillRect(prX + 5, prY + 18, 20, 3);
  // Printed object (animated height)
  const printHeight = 6 + Math.abs(Math.sin(frame * 0.02)) * 8;
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(prX + 10, prY + 18 - printHeight, 10, printHeight);
  // Nozzle
  ctx.fillStyle = '#808080';
  ctx.fillRect(prX + 13, prY + 8, 4, 6);
  // Status LED
  const printLed = frame % 40 < 30 ? '#40FF40' : '#204020';
  ctx.fillStyle = printLed;
  ctx.fillRect(prX + 25, prY + 2, 3, 2);

  // Industrial shelf with tools
  const shX = px + 60;
  const shY = py + 10;
  // Metal frame
  ctx.fillStyle = '#505050';
  ctx.fillRect(shX, shY, 3, 30);
  ctx.fillRect(shX + 37, shY, 3, 30);
  // Shelves
  ctx.fillStyle = '#707070';
  ctx.fillRect(shX, shY, 40, 3);
  ctx.fillRect(shX, shY + 14, 40, 3);
  ctx.fillRect(shX, shY + 28, 40, 3);
  // Items on shelves
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(shX + 5, shY + 4, 8, 10);
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(shX + 16, shY + 6, 6, 8);
  ctx.fillStyle = '#9B5DE5';
  ctx.fillRect(shX + 26, shY + 5, 10, 9);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(shX + 8, shY + 17, 12, 10);
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(shX + 24, shY + 19, 8, 8);

  // Tool board (pegboard style)
  const tbX = px + w - 45;
  const tbY = py + 8;
  ctx.fillStyle = '#D4C4A8';
  ctx.fillRect(tbX, tbY, 35, 28);
  // Pegboard holes
  ctx.fillStyle = '#B4A488';
  for (let ty = 0; ty < 5; ty++) {
    for (let tx = 0; tx < 7; tx++) {
      ctx.fillRect(tbX + 3 + tx * 5, tbY + 3 + ty * 5, 2, 2);
    }
  }
  // Hanging tools
  ctx.fillStyle = '#606060';
  ctx.fillRect(tbX + 6, tbY + 5, 2, 12);
  ctx.fillStyle = '#808080';
  ctx.fillRect(tbX + 4, tbY + 4, 6, 3);
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(tbX + 14, tbY + 6, 8, 4);
  ctx.fillRect(tbX + 16, tbY + 10, 4, 10);
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(tbX + 26, tbY + 5, 3, 14);

  // Workbench with vise
  const wbX = px + 70;
  const wbY = py + h - 40;
  ctx.fillStyle = 'rgba(60, 40, 20, 0.2)';
  ctx.fillRect(wbX + 2, wbY + 16, 40, 4);
  // Bench legs (metal)
  ctx.fillStyle = '#505050';
  ctx.fillRect(wbX + 2, wbY + 10, 4, 12);
  ctx.fillRect(wbX + 34, wbY + 10, 4, 12);
  // Bench top (wood)
  ctx.fillStyle = '#A08060';
  ctx.fillRect(wbX, wbY + 6, 40, 6);
  ctx.fillStyle = '#B09070';
  ctx.fillRect(wbX, wbY + 6, 40, 2);
  // Vise
  ctx.fillStyle = '#404040';
  ctx.fillRect(wbX + 30, wbY, 10, 8);
  ctx.fillStyle = '#606060';
  ctx.fillRect(wbX + 32, wbY + 2, 6, 4);

  // Soldering station
  const ssX = px + 15;
  const ssY = py + h - 35;
  ctx.fillStyle = 'rgba(50, 50, 60, 0.2)';
  ctx.fillRect(ssX + 2, ssY + 16, 20, 3);
  ctx.fillStyle = '#404040';
  ctx.fillRect(ssX, ssY + 6, 20, 12);
  ctx.fillStyle = '#505050';
  ctx.fillRect(ssX, ssY + 6, 20, 2);
  // Temperature display
  ctx.fillStyle = '#001820';
  ctx.fillRect(ssX + 3, ssY + 9, 14, 6);
  ctx.fillStyle = '#FF4040';
  ctx.font = '5px monospace';
  ctx.fillText('350', ssX + 5, ssY + 14);
  // Iron holder
  ctx.fillStyle = '#808080';
  ctx.fillRect(ssX + 16, ssY, 6, 8);
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(ssX + 18, ssY - 4, 2, 6);
};

const drawCreativeHubDecorations = (
  ctx: CanvasRenderingContext2D,
  px: number, py: number, w: number, h: number, frame: number
) => {
  // Giant post-it wall
  const postItX = px + 15;
  const postItY = py + 8;
  const postItColors = ['#FFD166', '#FF6B35', '#2EC4B6', '#9B5DE5', '#4CAF50'];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const color = postItColors[(row + col) % postItColors.length];
      ctx.fillStyle = color;
      ctx.fillRect(postItX + col * 14, postItY + row * 10, 12, 8);
      ctx.fillStyle = adjustBrightness(color, -0.15);
      ctx.fillRect(postItX + col * 14, postItY + row * 10 + 6, 12, 2);
      // Scribble marks
      ctx.fillStyle = '#404040';
      ctx.fillRect(postItX + col * 14 + 2, postItY + row * 10 + 2, 6, 1);
      ctx.fillRect(postItX + col * 14 + 2, postItY + row * 10 + 4, 4, 1);
    }
  }

  // Mood board
  const mbX = px + w - 50;
  const mbY = py + 8;
  ctx.fillStyle = '#E8E0D8';
  ctx.fillRect(mbX, mbY, 40, 32);
  ctx.strokeStyle = '#A89880';
  ctx.lineWidth = 2;
  ctx.strokeRect(mbX, mbY, 40, 32);
  ctx.lineWidth = 1;
  // Color swatches
  const swatchColors = ['#FF6B35', '#FFD166', '#2EC4B6', '#9B5DE5', '#4CAF50', '#FF4081'];
  swatchColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(mbX + 3 + (i % 3) * 12, mbY + 3 + Math.floor(i / 3) * 12, 10, 10);
  });
  // Inspiration images (abstract)
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(mbX + 3, mbY + 26, 34, 4);

  // Bean bag (purple)
  const bbX = px + 25;
  const bbY = py + h - 38;
  ctx.fillStyle = 'rgba(155, 93, 229, 0.2)';
  ctx.beginPath();
  ctx.ellipse(bbX + 14, bbY + 22, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9B5DE5';
  ctx.beginPath();
  ctx.ellipse(bbX + 14, bbY + 12, 16, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#B87DF0';
  ctx.beginPath();
  ctx.ellipse(bbX + 12, bbY + 6, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#C99DF5';
  ctx.beginPath();
  ctx.ellipse(bbX + 10, bbY + 4, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Design books stack
  const bkX = px + 60;
  const bkY = py + h - 30;
  const bookColors = ['#FF6B35', '#2EC4B6', '#FFD166', '#9B5DE5'];
  bookColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(bkX + i * 2, bkY + 10 - i * 4, 16, 5);
    ctx.fillStyle = adjustBrightness(color, 0.15);
    ctx.fillRect(bkX + i * 2, bkY + 10 - i * 4, 16, 1);
  });

  // Lego blocks / building blocks
  const lbX = px + 90;
  const lbY = py + h - 35;
  // Red block
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(lbX, lbY + 16, 20, 10);
  ctx.fillStyle = '#FF8B5A';
  ctx.fillRect(lbX, lbY + 16, 20, 3);
  // Studs
  ctx.fillStyle = '#FFB080';
  ctx.fillRect(lbX + 3, lbY + 13, 4, 3);
  ctx.fillRect(lbX + 13, lbY + 13, 4, 3);
  // Blue block
  ctx.fillStyle = '#2196F3';
  ctx.fillRect(lbX + 2, lbY + 6, 16, 10);
  ctx.fillStyle = '#4DB6FF';
  ctx.fillRect(lbX + 2, lbY + 6, 16, 3);
  // Yellow block
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(lbX + 4, lbY - 4, 12, 10);
  ctx.fillStyle = '#FFE088';
  ctx.fillRect(lbX + 4, lbY - 4, 12, 3);

  // Animated component flow diagram
  const cdX = px + w - 80;
  const cdY = py + 50;
  ctx.fillStyle = '#F5F5F0';
  ctx.fillRect(cdX, cdY, 36, 28);
  ctx.strokeStyle = '#C0C0B0';
  ctx.strokeRect(cdX, cdY, 36, 28);
  // Component boxes
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(cdX + 4, cdY + 4, 10, 8);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(cdX + 22, cdY + 4, 10, 8);
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(cdX + 13, cdY + 16, 10, 8);
  // Connecting lines
  ctx.strokeStyle = '#606060';
  ctx.beginPath();
  ctx.moveTo(cdX + 14, cdY + 8);
  ctx.lineTo(cdX + 22, cdY + 8);
  ctx.moveTo(cdX + 9, cdY + 12);
  ctx.lineTo(cdX + 9, cdY + 20);
  ctx.lineTo(cdX + 13, cdY + 20);
  ctx.moveTo(cdX + 27, cdY + 12);
  ctx.lineTo(cdX + 27, cdY + 20);
  ctx.lineTo(cdX + 23, cdY + 20);
  ctx.stroke();
  // Animated pulse
  const pulsePos = (frame * 0.08) % 1;
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.arc(cdX + 14 + 8 * pulsePos, cdY + 8, 2, 0, Math.PI * 2);
  ctx.fill();
};

const drawHotDeskDecorations = (
  ctx: CanvasRenderingContext2D,
  px: number, py: number, w: number, h: number, frame: number
) => {
  // Low dividers/privacy screens
  const divX = px + w - 30;
  const divY = py + 20;
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(divX, divY, 3, 40);
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(divX, divY, 3, 2);
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(divX + 1, divY + 5, 1, 30);

  // Plants throughout the space
  const plantPositions = [
    { x: px + w - 35, y: py + 25 },
    { x: px + 20, y: py + h - 45 },
  ];
  plantPositions.forEach((pos, i) => {
    // Pot
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(pos.x, pos.y + 12, 12, 10);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(pos.x - 1, pos.y + 10, 14, 3);
    // Plant
    const plantColor = i % 2 === 0 ? '#4CAF50' : '#2E7D32';
    ctx.fillStyle = plantColor;
    ctx.beginPath();
    ctx.ellipse(pos.x + 6, pos.y + 4, 10, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = adjustBrightness(plantColor, 0.15);
    ctx.beginPath();
    ctx.ellipse(pos.x + 4, pos.y + 2, 6, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Communal supply station
  const ssX = px + 60;
  const ssY = py + 8;
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(ssX, ssY, 50, 3);
  // Supplies on shelf
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(ssX + 4, ssY - 8, 8, 8);
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(ssX + 16, ssY - 10, 6, 10);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(ssX + 26, ssY - 6, 8, 6);
  ctx.fillStyle = '#9B5DE5';
  ctx.fillRect(ssX + 38, ssY - 8, 8, 8);

  // Shared printer
  const prX = px + 20;
  const prY = py + 10;
  ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
  ctx.fillRect(prX + 2, prY + 16, 24, 3);
  ctx.fillStyle = '#404040';
  ctx.fillRect(prX, prY, 24, 16);
  ctx.fillStyle = '#505050';
  ctx.fillRect(prX, prY, 24, 3);
  // Paper tray
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(prX + 4, prY + 12, 16, 2);
  // Status light
  const printerOn = frame % 80 < 70;
  ctx.fillStyle = printerOn ? '#4CAF50' : '#2E7D32';
  ctx.fillRect(prX + 20, prY + 2, 2, 2);

  // Code poster / motivational quote
  const qX = px + 120;
  const qY = py + 10;
  if (w > 150) {
    ctx.fillStyle = '#303030';
    ctx.fillRect(qX, qY, 30, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '5px sans-serif';
    ctx.fillText('SHIP IT', qX + 4, qY + 10);
    ctx.fillStyle = '#2EC4B6';
    ctx.fillRect(qX + 2, qY + 14, 26, 2);
  }

  // Filing cabinet (modern)
  const fcX = px + 50;
  const fcY = py + h - 40;
  ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
  ctx.fillRect(fcX + 2, fcY + 26, 20, 3);
  ctx.fillStyle = '#505050';
  ctx.fillRect(fcX, fcY, 20, 26);
  ctx.fillStyle = '#606060';
  ctx.fillRect(fcX, fcY, 20, 2);
  for (let d = 0; d < 3; d++) {
    ctx.fillStyle = '#454545';
    ctx.fillRect(fcX + 2, fcY + 4 + d * 8, 16, 6);
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(fcX + 8, fcY + 6 + d * 8, 4, 2);
  }
};

const drawQuietZoneDecorations = (
  ctx: CanvasRenderingContext2D,
  px: number, py: number, w: number, h: number, frame: number
) => {
  // Cozy bookshelf
  const bsX = px + 15;
  const bsY = py + 12;
  ctx.fillStyle = '#A08060';
  ctx.fillRect(bsX, bsY, 30, 24);
  ctx.fillStyle = '#B09070';
  ctx.fillRect(bsX, bsY, 30, 2);
  ctx.fillStyle = '#907050';
  ctx.fillRect(bsX, bsY + 10, 30, 2);
  ctx.fillRect(bsX, bsY + 22, 30, 2);
  // Books (muted colors)
  ctx.fillStyle = '#6D8299';
  ctx.fillRect(bsX + 2, bsY + 2, 6, 8);
  ctx.fillStyle = '#99806D';
  ctx.fillRect(bsX + 9, bsY + 3, 5, 7);
  ctx.fillStyle = '#6D9980';
  ctx.fillRect(bsX + 15, bsY + 2, 7, 8);
  ctx.fillStyle = '#806D99';
  ctx.fillRect(bsX + 23, bsY + 3, 5, 7);
  ctx.fillStyle = '#998A6D';
  ctx.fillRect(bsX + 3, bsY + 12, 8, 10);
  ctx.fillStyle = '#6D8A99';
  ctx.fillRect(bsX + 13, bsY + 13, 6, 9);
  ctx.fillStyle = '#8A6D99';
  ctx.fillRect(bsX + 21, bsY + 12, 7, 10);

  // Reading armchair
  const acX = px + 55;
  const acY = py + h - 45;
  ctx.fillStyle = 'rgba(100, 80, 60, 0.2)';
  ctx.beginPath();
  ctx.ellipse(acX + 14, acY + 28, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Chair base
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(acX + 2, acY + 12, 24, 16);
  ctx.fillStyle = '#9B8365';
  ctx.fillRect(acX + 2, acY + 12, 24, 3);
  // Chair back
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(acX + 4, acY, 20, 14);
  ctx.fillStyle = '#9B8365';
  ctx.fillRect(acX + 4, acY, 20, 2);
  // Arms
  ctx.fillStyle = '#7B6345';
  ctx.fillRect(acX, acY + 6, 4, 20);
  ctx.fillRect(acX + 24, acY + 6, 4, 20);
  // Cushion
  ctx.fillStyle = '#A08060';
  ctx.fillRect(acX + 6, acY + 14, 16, 8);

  // Floor lamp
  const flX = px + 90;
  const flY = py + 15;
  ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
  ctx.beginPath();
  ctx.ellipse(flX + 4, flY + 40, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Base
  ctx.fillStyle = '#404040';
  ctx.fillRect(flX + 2, flY + 36, 4, 4);
  // Pole
  ctx.fillStyle = '#505050';
  ctx.fillRect(flX + 3, flY + 8, 2, 30);
  // Shade
  ctx.fillStyle = '#F5F5DC';
  ctx.beginPath();
  ctx.moveTo(flX - 2, flY + 10);
  ctx.lineTo(flX + 10, flY + 10);
  ctx.lineTo(flX + 8, flY);
  ctx.lineTo(flX, flY);
  ctx.closePath();
  ctx.fill();
  // Light glow
  ctx.fillStyle = 'rgba(255, 248, 220, 0.15)';
  ctx.beginPath();
  ctx.ellipse(flX + 4, flY + 20, 12, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Small side table with tea
  const stX = px + w - 40;
  const stY = py + h - 35;
  ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
  ctx.fillRect(stX + 2, stY + 14, 16, 3);
  ctx.fillStyle = '#A08060';
  ctx.fillRect(stX, stY + 8, 16, 8);
  ctx.fillStyle = '#B09070';
  ctx.fillRect(stX - 1, stY + 6, 18, 3);
  // Tea cup
  ctx.fillStyle = '#F5F5F0';
  ctx.fillRect(stX + 4, stY, 8, 6);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(stX + 5, stY + 1, 6, 4);
  // Steam (animated)
  const steamPhase = (frame * 0.04) % 1;
  const steamOpacity = (1 - steamPhase) * 0.3;
  ctx.fillStyle = `rgba(255, 255, 255, ${steamOpacity})`;
  ctx.beginPath();
  ctx.arc(stX + 7 + Math.sin(frame * 0.03) * 1, stY - 3 - steamPhase * 6, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Noise-canceling headphones stand
  const hsX = px + w - 30;
  const hsY = py + 15;
  ctx.fillStyle = '#505050';
  ctx.fillRect(hsX + 3, hsY + 10, 4, 12);
  ctx.fillStyle = '#404040';
  ctx.fillRect(hsX, hsY + 20, 10, 4);
  // Headphones
  ctx.fillStyle = '#303030';
  ctx.beginPath();
  ctx.arc(hsX + 5, hsY + 6, 6, Math.PI, 0);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = '#404040';
  ctx.beginPath();
  ctx.ellipse(hsX, hsY + 8, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(hsX + 10, hsY + 8, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Ear cushions
  ctx.fillStyle = '#606060';
  ctx.beginPath();
  ctx.ellipse(hsX, hsY + 8, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(hsX + 10, hsY + 8, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // "Quiet Zone" sign
  const qsX = px + 50;
  const qsY = py + 8;
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(qsX, qsY, 35, 14);
  ctx.fillStyle = '#26A89C';
  ctx.fillRect(qsX, qsY + 12, 35, 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '6px sans-serif';
  ctx.fillText('QUIET', qsX + 6, qsY + 10);
};
