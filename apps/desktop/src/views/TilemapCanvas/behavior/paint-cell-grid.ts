/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { CELL_GRID_MIN, GRID_CELL_CAP } from '../TilemapCanvas.constants';
import type { MapPaintState } from '../TilemapCanvas.type';
import { targetGeometry } from './target-geometry';

const paintCellGrid = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState): void => {
  const { tileset, tilemap } = state.target;
  if (!state.cells || Math.min(tileset.tileWidth, tileset.tileHeight) * view.zoom < CELL_GRID_MIN) return;
  const geometry = targetGeometry(state.target);
  if (tilemap.orientation && tilemap.columns * tilemap.rows > GRID_CELL_CAP) return;
  ctx.save();
  ctx.globalAlpha = state.look.tileLine.opacity;
  ctx.strokeStyle = state.look.tileLine.colour;
  ctx.lineWidth = 1 / view.zoom;
  ctx.beginPath();
  if (tilemap.orientation) {
    for (let row = 0; row < tilemap.rows; row += 1) {
      for (let column = 0; column < tilemap.columns; column += 1) {
        geometry.outline(column, row).forEach((point, at) => (at === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
        ctx.closePath();
      }
    }
  } else {
    for (let column = 0; column <= tilemap.columns; column += 1) {
      ctx.moveTo(column * tileset.tileWidth, 0);
      ctx.lineTo(column * tileset.tileWidth, geometry.height);
    }
    for (let row = 0; row <= tilemap.rows; row += 1) {
      ctx.moveTo(0, row * tileset.tileHeight);
      ctx.lineTo(geometry.width, row * tileset.tileHeight);
    }
  }
  ctx.stroke();
  ctx.restore();
};

export { paintCellGrid };
