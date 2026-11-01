/* @layer renderer-app @kind logic */
import { emptyMask, maskBounds } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { ISLAND_NEIGHBOURS } from './island-neighbours.constants';
import type { MaskIsland } from './mask-islands.type';

const flood = (mask: MaskView, seen: Uint8Array, first: number): MaskView => {
  const island = emptyMask(mask);
  const queue = [first];
  seen[first] = 1;
  while (queue.length > 0) {
    const at = queue.pop() ?? 0;
    island.bits[at] = 1;
    const x = at % mask.width;
    const y = Math.floor(at / mask.width);
    for (const step of ISLAND_NEIGHBOURS) {
      const nx = x + step.x;
      const ny = y + step.y;
      const next = ny * mask.width + nx;
      if (nx < 0 || ny < 0 || nx >= mask.width || ny >= mask.height || mask.bits[next] === 0 || seen[next] === 1) continue;
      seen[next] = 1;
      queue.push(next);
    }
  }
  return island;
};

const maskIslands = (mask: MaskView): MaskIsland[] => {
  const seen = new Uint8Array(mask.bits.length);
  const islands: MaskIsland[] = [];
  for (const [at, bit] of mask.bits.entries()) {
    if (bit === 0 || seen[at] === 1) continue;
    const island = flood(mask, seen, at);
    const box = maskBounds(island);
    if (box) islands.push({ mask: island, box });
  }
  return islands;
};

export { maskIslands };
