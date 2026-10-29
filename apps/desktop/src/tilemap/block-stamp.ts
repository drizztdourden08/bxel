/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';
import { bitsOfFlags } from './flag-bits-convert';
import { readCell } from './read-cell';
import type { MapTarget } from './tilemap.type';

const blockStamp = (target: Pick<MapTarget, 'tilemap' | 'layer'>, rect: Rect, mask: Uint8Array | null): TileStamp => {
  const keys: number[] = [];
  const bits: number[] = [];
  for (let row = 0; row < rect.height; row += 1) {
    for (let column = 0; column < rect.width; column += 1) {
      const picked = mask === null || mask[row * rect.width + column] === 1;
      const read = picked ? readCell(target.tilemap, target.layer, { x: rect.x + column, y: rect.y + row }) : null;
      keys.push(read?.key ?? 0);
      bits.push(read && read.key !== 0 ? bitsOfFlags(read.flags) : 0);
    }
  }
  return { columns: rect.width, rows: rect.height, keys, ...(bits.some((each) => each !== 0) ? { bits } : {}) };
};

export { blockStamp };
