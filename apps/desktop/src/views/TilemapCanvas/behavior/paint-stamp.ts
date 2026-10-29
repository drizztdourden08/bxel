/* @layer renderer-app @kind logic */
import { findSprite, findTile } from '@bxel/document';
import type { Point } from '@bxel/document';
import type { TileStamp } from '../../../stores/tilemap-store.type';
import { stampPlacements } from '../../../tilemap/stamp-placements';
import { tileCanvas } from '../../../tilemap/tile-canvas';
import { GHOST_ALPHA } from '../TilemapCanvas.constants';
import type { MapPaintState } from '../TilemapCanvas.type';
import { cellMatrix } from './cell-matrix';
import { targetGeometry } from './target-geometry';

const paintStamp = (ctx: CanvasRenderingContext2D, state: MapPaintState, stamp: TileStamp, origin: Point): void => {
  const { target, flags } = state;
  const { tileset, artwork } = target;
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  const geometry = targetGeometry(target);
  ctx.save();
  ctx.globalAlpha = GHOST_ALPHA;
  for (const { key, cell, flags: own } of stampPlacements(stamp, origin, target.tilemap)) {
    const tile = findTile(tileset, key);
    const sprite = tile ? findSprite(artwork, tile.spriteId) : undefined;
    const canvas = sprite ? tileCanvas(artwork, sprite) : null;
    if (!canvas) continue;
    ctx.save();
    const corner = geometry.originOf(cell.x, cell.y);
    ctx.translate(corner.x, corner.y);
    ctx.transform(...cellMatrix(own ?? flags, size));
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  }
  ctx.restore();
};

export { paintStamp };
