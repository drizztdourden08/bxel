/* @layer renderer-app @kind logic */
import { rectMask } from '@bxel/raster';
import type { MaskView, Point } from '@bxel/raster';

type CellSpace = { readonly width: number; readonly height: number };

const tileCellMask = (space: CellSpace, tile: CellSpace, at: Point): MaskView => {
  const left = Math.floor(at.x / tile.width) * tile.width;
  const top = Math.floor(at.y / tile.height) * tile.height;
  return rectMask(space, {
    from: { x: left, y: top },
    to: { x: Math.min(left + tile.width, space.width) - 1, y: Math.min(top + tile.height, space.height) - 1 },
  });
};

export { tileCellMask };
