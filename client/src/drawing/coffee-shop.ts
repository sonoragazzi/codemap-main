// Break room / Caffetteria drawing - Industrial coworking style
import { RoomLayout } from './types';

// Draw break room in corridor area
export const drawCoffeeShop = (
  ctx: CanvasRenderingContext2D,
  _layout: RoomLayout,
  buildingX: number, buildingY: number,
  buildingW: number, buildingH: number
) => {
  const breakRoomX = buildingX + buildingW * 0.68;
  const breakRoomY = buildingY + buildingH * 0.84;

  // Break room floor area (modern concrete look)
  ctx.fillStyle = '#D0D0D0';
  ctx.fillRect(breakRoomX - 10, breakRoomY - 5, 140, 55);
  // Subtle checkerboard pattern
  ctx.fillStyle = '#D8D8D8';
  for (let ty = 0; ty < 4; ty++) {
    for (let tx = 0; tx < 9; tx++) {
      if ((tx + ty) % 2 === 0) {
        ctx.fillRect(breakRoomX - 10 + tx * 16, breakRoomY - 5 + ty * 14, 15, 13);
      }
    }
  }

  // Industrial bar counter (wood + metal)
  const barX = breakRoomX;
  const barY = breakRoomY;
  ctx.fillStyle = 'rgba(50, 50, 60, 0.2)';
  ctx.fillRect(barX + 2, barY + 22, 70, 5);
  // Metal base
  ctx.fillStyle = '#505050';
  ctx.fillRect(barX, barY + 14, 70, 8);
  ctx.fillStyle = '#606060';
  ctx.fillRect(barX, barY + 14, 70, 2);
  // Wood top
  ctx.fillStyle = '#A08060';
  ctx.fillRect(barX - 2, barY - 3, 74, 18);
  ctx.fillStyle = '#B09070';
  ctx.fillRect(barX - 2, barY - 3, 74, 3);
  ctx.fillStyle = '#907050';
  ctx.fillRect(barX - 2, barY + 12, 74, 3);

  // Professional espresso machine
  const espX = barX + 6;
  const espY = barY - 18;
  ctx.fillStyle = '#303030';
  ctx.fillRect(espX, espY, 22, 16);
  ctx.fillStyle = '#404040';
  ctx.fillRect(espX, espY, 22, 3);
  ctx.fillStyle = '#252525';
  ctx.fillRect(espX, espY + 13, 22, 3);
  // Chrome accents
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(espX + 3, espY + 6, 6, 8);
  ctx.fillRect(espX + 12, espY + 6, 6, 8);
  // Pressure gauge
  ctx.fillStyle = '#F0F0E0';
  ctx.beginPath();
  ctx.arc(espX + 11, espY + 3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(espX + 10, espY + 2, 2, 2);

  // Colorful coffee cups
  const cupColors = ['#2EC4B6', '#FF6B35', '#FFD166', '#9B5DE5'];
  cupColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(barX + 32 + i * 8, barY - 12 + (i % 2) * 2, 6, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(barX + 33 + i * 8, barY - 11 + (i % 2) * 2, 4, 2);
  });

  // Pastry display (modern glass case)
  const pastryX = barX + 52;
  const pastryY = barY - 15;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(pastryX, pastryY, 20, 14);
  ctx.fillStyle = 'rgba(200, 230, 255, 0.5)';
  ctx.fillRect(pastryX + 2, pastryY + 2, 16, 10);
  // Pastries (colorful)
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(pastryX + 3, pastryY + 6, 5, 4);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(pastryX + 10, pastryY + 5, 5, 5);

  // Menu board (digital display style)
  const menuX = barX + 15;
  const menuY = barY - 35;
  ctx.fillStyle = '#252525';
  ctx.fillRect(menuX, menuY, 45, 20);
  ctx.fillStyle = '#303030';
  ctx.fillRect(menuX + 2, menuY + 2, 41, 16);
  // Menu text (teal accent)
  ctx.fillStyle = '#2EC4B6';
  ctx.font = '6px monospace';
  ctx.fillText('ESPRESSO  $3', menuX + 4, menuY + 8);
  ctx.fillText('LATTE     $4', menuX + 4, menuY + 15);
  // Power LED
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(menuX + 40, menuY + 3, 2, 2);

  // Fridgr with glass front (drinks)
  const fridgeX = barX - 20;
  const fridgeY = barY - 25;
  ctx.fillStyle = '#404040';
  ctx.fillRect(fridgeX, fridgeY, 18, 30);
  ctx.fillStyle = '#505050';
  ctx.fillRect(fridgeX, fridgeY, 18, 3);
  // Glass door
  ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';
  ctx.fillRect(fridgeX + 2, fridgeY + 4, 14, 24);
  // Drinks inside
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(fridgeX + 4, fridgeY + 8, 4, 8);
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(fridgeX + 9, fridgeY + 8, 4, 8);
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(fridgeX + 4, fridgeY + 18, 4, 6);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(fridgeX + 9, fridgeY + 18, 4, 6);

  // High table with stools
  const t1X = breakRoomX + 85;
  const t1Y = breakRoomY + 2;
  ctx.fillStyle = 'rgba(50, 50, 60, 0.15)';
  ctx.beginPath();
  ctx.ellipse(t1X + 10, t1Y + 18, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // Table leg (metal)
  ctx.fillStyle = '#505050';
  ctx.fillRect(t1X + 8, t1Y + 6, 4, 12);
  // Table top (white)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(t1X + 10, t1Y + 5, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F0F0F0';
  ctx.beginPath();
  ctx.arc(t1X + 10, t1Y + 3, 10, 0, Math.PI * 2);
  ctx.fill();

  // Coffee cup on table
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(t1X + 6, t1Y - 2, 6, 5);
  ctx.fillStyle = '#1E8C82';
  ctx.fillRect(t1X + 7, t1Y - 1, 4, 3);

  // Bar stools (modern style)
  // Stool 1
  ctx.fillStyle = '#FF6B35';
  ctx.beginPath();
  ctx.ellipse(t1X - 6, t1Y + 6, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#505050';
  ctx.fillRect(t1X - 7, t1Y + 8, 2, 10);
  // Stool 2
  ctx.fillStyle = '#2EC4B6';
  ctx.beginPath();
  ctx.ellipse(t1X + 26, t1Y + 6, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#505050';
  ctx.fillRect(t1X + 25, t1Y + 8, 2, 10);

  // Bulletin board with flyers
  const bbX = breakRoomX + 100;
  const bbY = breakRoomY - 30;
  ctx.fillStyle = '#D4A574';
  ctx.fillRect(bbX, bbY, 28, 22);
  ctx.strokeStyle = '#A08060';
  ctx.lineWidth = 2;
  ctx.strokeRect(bbX, bbY, 28, 22);
  ctx.lineWidth = 1;
  // Colorful flyers
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(bbX + 3, bbY + 3, 8, 6);
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(bbX + 13, bbY + 4, 10, 8);
  ctx.fillStyle = '#2EC4B6';
  ctx.fillRect(bbX + 5, bbY + 11, 10, 8);
  ctx.fillStyle = '#9B5DE5';
  ctx.fillRect(bbX + 17, bbY + 14, 8, 6);
  // Pins
  ctx.fillStyle = '#FF6B35';
  ctx.beginPath();
  ctx.arc(bbX + 6, bbY + 4, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2EC4B6';
  ctx.beginPath();
  ctx.arc(bbX + 17, bbY + 5, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Hanging plants (macrame style)
  const plantX = breakRoomX + 70;
  const plantY = breakRoomY - 40;
  // Hanger
  ctx.strokeStyle = '#D4C4A8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(plantX + 5, plantY - 10);
  ctx.lineTo(plantX + 5, plantY);
  ctx.stroke();
  ctx.lineWidth = 1;
  // Pot
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(plantX, plantY, 10, 8);
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(plantX - 1, plantY - 2, 12, 3);
  // Plant
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.ellipse(plantX + 5, plantY - 4, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Trailing
  ctx.fillStyle = '#2E7D32';
  ctx.fillRect(plantX + 2, plantY + 6, 2, 6);
  ctx.fillRect(plantX + 6, plantY + 5, 2, 8);

  // Break room sign (modern)
  const signX = breakRoomX + 15;
  const signY = breakRoomY - 45;
  ctx.fillStyle = '#303030';
  ctx.fillRect(signX, signY, 40, 14);
  ctx.fillStyle = '#404040';
  ctx.fillRect(signX + 2, signY + 2, 36, 10);
  ctx.fillStyle = '#2EC4B6';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BREAK', signX + 20, signY + 10);
  ctx.textAlign = 'left';

  // Recycling bins (colorful)
  const binX = breakRoomX + 115;
  const binY = breakRoomY + 25;
  // Paper (blue)
  ctx.fillStyle = '#2196F3';
  ctx.fillRect(binX, binY, 8, 12);
  ctx.fillStyle = '#1976D2';
  ctx.fillRect(binX, binY + 10, 8, 2);
  // Plastic (yellow)
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(binX + 10, binY, 8, 12);
  ctx.fillStyle = '#E6B84F';
  ctx.fillRect(binX + 10, binY + 10, 8, 2);
  // General (gray)
  ctx.fillStyle = '#606060';
  ctx.fillRect(binX + 20, binY, 8, 12);
  ctx.fillStyle = '#505050';
  ctx.fillRect(binX + 20, binY + 10, 8, 2);
};
