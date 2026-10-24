/* @layer core @kind logic */
import type { BlitTile } from './blit-tile.type';
import { sourceOffset } from './source-offset';

const blitTile = ({ target, targetWidth, source, tile, origin, cell }: BlitTile): void => {
  for (let dy = 0; dy < tile.height; dy += 1) {
    for (let dx = 0; dx < tile.width; dx += 1) {
      const value = source[sourceOffset(cell, tile, dx, dy)] ?? 0;
      if (value !== 0) target[(origin.y + dy) * targetWidth + origin.x + dx] = value;
    }
  }
};

export { blitTile };
