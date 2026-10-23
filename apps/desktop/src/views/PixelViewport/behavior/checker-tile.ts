/* @layer renderer-app @kind logic */
import type { ViewLook } from './viewport.type';

const checkerTile = (doc: Document, look: ViewLook, dpr: number): HTMLCanvasElement => {
  const cell = Math.max(1, Math.round(look.check * dpr));
  const tile = doc.createElement('canvas');
  tile.width = cell * 2;
  tile.height = cell * 2;
  const ctx = tile.getContext('2d');
  if (!ctx) return tile;
  ctx.fillStyle = look.checkA;
  ctx.fillRect(0, 0, cell * 2, cell * 2);
  ctx.fillStyle = look.checkB;
  ctx.fillRect(cell, 0, cell, cell);
  ctx.fillRect(0, cell, cell, cell);
  return tile;
};

export { checkerTile };
