/* @layer renderer-app @kind logic */
import { PATTERN_CELLS, PATTERN_SIZE } from './canvas-look.constants';
import type { CanvasLook } from './canvas-look.type';
import { isBitSet } from './is-bit-set';

const surroundTile = (doc: Document, look: CanvasLook, dpr: number): HTMLCanvasElement => {
  const cell = Math.max(1, Math.round(look.surroundScale * dpr));
  const tile = doc.createElement('canvas');
  tile.width = cell * PATTERN_SIZE;
  tile.height = cell * PATTERN_SIZE;
  const ctx = tile.getContext('2d');
  if (!ctx) return tile;
  ctx.fillStyle = look.surroundA;
  ctx.fillRect(0, 0, tile.width, tile.height);
  ctx.fillStyle = look.surroundB;
  for (let index = 0; index < PATTERN_CELLS; index += 1) {
    if (isBitSet(look.surroundBits, index)) ctx.fillRect((index % PATTERN_SIZE) * cell, Math.floor(index / PATTERN_SIZE) * cell, cell, cell);
  }
  return tile;
};

export { surroundTile };
