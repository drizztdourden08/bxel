/* @layer renderer-app @kind logic */
import { neighbourSource } from '../../../tilemap/neighbour-source';
import { useViewStore } from '../../../stores/useViewStore';
import type { OverlayLook } from './canvas-tools.type';
import { NEIGHBOUR_OFFSETS, NEIGHBOUR_VEIL } from './paint-neighbours.constants';

const paintNeighbours = (ctx: CanvasRenderingContext2D, look: OverlayLook): void => {
  const source = neighbourSource();
  if (!source || useViewStore.getState().hideOverlays) return;
  const { canvas, at, columns, rows, tileWidth, tileHeight } = source;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (const step of NEIGHBOUR_OFFSETS) {
    const cell = { x: at.x + step.x, y: at.y + step.y };
    if (cell.x < 0 || cell.y < 0 || cell.x >= columns || cell.y >= rows) continue;
    const left = step.x * tileWidth;
    const top = step.y * tileHeight;
    ctx.globalAlpha = 1;
    ctx.drawImage(canvas, cell.x * tileWidth, cell.y * tileHeight, tileWidth, tileHeight, left, top, tileWidth, tileHeight);
    ctx.globalAlpha = NEIGHBOUR_VEIL;
    ctx.fillStyle = look.ground;
    ctx.fillRect(left, top, tileWidth, tileHeight);
  }
  ctx.restore();
};

export { paintNeighbours };
