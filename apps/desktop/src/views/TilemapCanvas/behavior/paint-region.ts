/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { REGION_CELL_CAP, SHADE_ALPHA } from '../TilemapCanvas.constants';
import type { CellRegion, MapPaintState } from '../TilemapCanvas.type';
import { applyStroke } from './apply-stroke';
import { cellBox } from './cell-box';
import { paintBox } from './paint-box';
import { targetGeometry } from './target-geometry';

const paintRegion = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, region: CellRegion): void => {
  const { cells, style } = region;
  if (!state.target.tilemap.orientation) {
    paintBox(ctx, view, cellBox(cells, state.target.tileset), style);
    return;
  }
  const geometry = targetGeometry(state.target);
  ctx.save();
  ctx.beginPath();
  const last = { x: cells.x + cells.width, y: cells.y + cells.height };
  let count = 0;
  for (let row = cells.y; row < last.y && count < REGION_CELL_CAP; row += 1) {
    for (let column = cells.x; column < last.x && count < REGION_CELL_CAP; column += 1) {
      count += 1;
      geometry.outline(column, row).forEach((point, at) => (at === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
      ctx.closePath();
    }
  }
  ctx.globalAlpha = SHADE_ALPHA;
  ctx.fillStyle = style.colour;
  ctx.fill();
  applyStroke(ctx, view, style);
  ctx.stroke();
  ctx.restore();
};

export { paintRegion };
