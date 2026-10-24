/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { CURSOR_LINE, SELECT_DASH } from '../TilemapCanvas.constants';
import type { BoxStyle } from '../TilemapCanvas.type';

const applyStroke = (ctx: CanvasRenderingContext2D, view: PixelView, style: BoxStyle): void => {
  ctx.globalAlpha = 1;
  ctx.strokeStyle = style.colour;
  ctx.lineWidth = CURSOR_LINE / view.zoom;
  if (style.dashed) ctx.setLineDash(SELECT_DASH.map((part) => part / view.zoom));
};

export { applyStroke };
