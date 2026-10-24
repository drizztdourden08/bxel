/* @layer renderer-app @kind logic */
import { findSprite, findTile } from '@bxel/document';
import type { Point } from '@bxel/document';
import { stampPlacements } from '../../../tilemap/stamp-placements';
import { tileCanvas } from '../../../tilemap/tile-canvas';
import { usableStamp } from '../../../tilemap/usable-stamp';
import { GHOST_ALPHA } from '../TilemapCanvas.constants';
import type { MapPaintState } from '../TilemapCanvas.type';
import { cellMatrix } from './cell-matrix';

const paintGhost = (ctx: CanvasRenderingContext2D, state: MapPaintState, origin: Point): void => {
  const { target, stamp, flags } = state;
  const { tileset, artwork } = target;
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  ctx.save();
  ctx.globalAlpha = GHOST_ALPHA;
  for (const { key, cell } of stampPlacements(usableStamp(stamp, tileset), origin, target.tilemap)) {
    const tile = findTile(tileset, key);
    const sprite = tile ? findSprite(artwork, tile.spriteId) : undefined;
    const canvas = sprite ? tileCanvas(artwork, sprite) : null;
    if (!canvas) continue;
    ctx.save();
    ctx.translate(cell.x * size.width, cell.y * size.height);
    ctx.transform(...cellMatrix(flags, size));
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  }
  ctx.restore();
};

export { paintGhost };
