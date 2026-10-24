/* @layer renderer-app @kind logic */
import { cellKey, readCellFlags } from '@bxel/document';
import type { TileCollision } from '@bxel/document';
import { outlinePoints } from '../../../tilemap/collision/outline-points';
import { COLLISION_ALPHA } from '../TilemapCanvas.constants';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { cellMatrix } from './cell-matrix';

const shapesOf = (state: MapPaintState): ReadonlyMap<number, TileCollision> =>
  new Map(state.target.tileset.tiles.flatMap((tile) => (tile.collision ? [[tile.key, tile.collision] as const] : [])));

const paintCollision = (ctx: CanvasRenderingContext2D, state: MapPaintState, look: MapLook): void => {
  if (!state.collision) return;
  const shapes = shapesOf(state);
  if (shapes.size === 0) return;
  const { tilemap, tileset } = state.target;
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  ctx.save();
  ctx.globalAlpha = COLLISION_ALPHA;
  ctx.fillStyle = look.collision;
  for (const layer of tilemap.layers.filter((each) => each.visible)) {
    layer.cells.forEach((cell, index) => {
      const shape = shapes.get(cellKey(cell));
      if (!shape) return;
      const column = index % tilemap.columns;
      ctx.save();
      ctx.translate(column * size.width, ((index - column) / tilemap.columns) * size.height);
      ctx.transform(...cellMatrix(readCellFlags(cell), size));
      ctx.beginPath();
      outlinePoints(shape, size).forEach((point, at) => (at === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }
  ctx.restore();
};

export { paintCollision };
