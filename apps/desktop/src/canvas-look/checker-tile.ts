/* @layer renderer-app @kind logic */
import type { CanvasLook } from './canvas-look.type';

const checkerTile = (doc: Document, look: CanvasLook, dpr: number): HTMLCanvasElement => {
  const cell = Math.max(1, Math.round(look.checkerSize * dpr));
  const tile = doc.createElement('canvas');
  tile.width = cell * 2;
  tile.height = cell * 2;
  const ctx = tile.getContext('2d');
  if (!ctx) return tile;
  ctx.fillStyle = look.checkerA;
  ctx.fillRect(0, 0, cell * 2, cell * 2);
  ctx.fillStyle = look.checkerB;
  ctx.fillRect(cell, 0, cell, cell);
  ctx.fillRect(0, cell, cell, cell);
  return tile;
};

export { checkerTile };
