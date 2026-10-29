/* @layer renderer-app @kind logic */
import { cellKey, readCellFlags, tileShapes } from '@bxel/document';
import type { TileCollision } from '@bxel/document';
import { outlinePoints } from '../../../tilemap/collision/outline-points';
import { COLLISION_ALPHA } from '../TilemapCanvas.constants';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { cellMatrix } from './cell-matrix';
import { targetGeometry } from './target-geometry';

const shapesOf = (state: MapPaintState): ReadonlyMap<number, readonly TileCollision[]> =>
  new Map(state.target.tileset.tiles.flatMap((tile) => (tileShapes(tile).length > 0 ? [[tile.key, tileShapes(tile)] as const] : [])));

const paintCollision = (ctx: CanvasRenderingContext2D, state: MapPaintState, look: MapLook): void => {
  if (!state.collision) return;
  const shapes = shapesOf(state);
  if (shapes.size === 0) return;
  const { tilemap, tileset } = state.target;
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  const geometry = targetGeometry(state.target);
  ctx.save();
  ctx.globalAlpha = COLLISION_ALPHA;
  ctx.fillStyle = look.collision;
  for (const layer of tilemap.layers.filter((each) => each.visible)) {
    layer.cells.forEach((cell, index) => {
      const found = shapes.get(cellKey(cell));
      if (!found) return;
      const column = index % tilemap.columns;
      ctx.save();
      const origin = geometry.originOf(column, (index - column) / tilemap.columns);
      ctx.translate(origin.x, origin.y);
      ctx.transform(...cellMatrix(readCellFlags(cell), size));
      for (const shape of found) {
        ctx.beginPath();
        outlinePoints(shape, size).forEach((point, at) => (at === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });
  }
  ctx.restore();
};

export { paintCollision };
