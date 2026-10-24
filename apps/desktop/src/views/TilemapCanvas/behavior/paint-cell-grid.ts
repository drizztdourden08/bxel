/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { CELL_GRID_MIN } from '../TilemapCanvas.constants';
import type { MapPaintState } from '../TilemapCanvas.type';

const paintCellGrid = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState): void => {
  const { tileset, tilemap } = state.target;
  if (!state.cells || Math.min(tileset.tileWidth, tileset.tileHeight) * view.zoom < CELL_GRID_MIN) return;
  const width = tilemap.columns * tileset.tileWidth;
  const height = tilemap.rows * tileset.tileHeight;
  ctx.save();
  ctx.globalAlpha = state.look.tileLine.opacity;
  ctx.strokeStyle = state.look.tileLine.colour;
  ctx.lineWidth = 1 / view.zoom;
  ctx.beginPath();
  for (let column = 0; column <= tilemap.columns; column += 1) {
    ctx.moveTo(column * tileset.tileWidth, 0);
    ctx.lineTo(column * tileset.tileWidth, height);
  }
  for (let row = 0; row <= tilemap.rows; row += 1) {
    ctx.moveTo(0, row * tileset.tileHeight);
    ctx.lineTo(width, row * tileset.tileHeight);
  }
  ctx.stroke();
  ctx.restore();
};

export { paintCellGrid };
