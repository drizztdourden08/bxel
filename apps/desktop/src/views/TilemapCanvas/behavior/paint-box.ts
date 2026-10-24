/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';
import { CURSOR_LINE, SELECT_DASH, SHADE_ALPHA } from '../TilemapCanvas.constants';
import type { BoxStyle } from '../TilemapCanvas.type';
import type { PixelView } from '../../PixelViewport';

const paintBox = (ctx: CanvasRenderingContext2D, view: PixelView, box: Rect, style: BoxStyle): void => {
  ctx.save();
  ctx.globalAlpha = SHADE_ALPHA;
  ctx.fillStyle = style.colour;
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = style.colour;
  ctx.lineWidth = CURSOR_LINE / view.zoom;
  if (style.dashed) ctx.setLineDash(SELECT_DASH.map((part) => part / view.zoom));
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.restore();
};

export { paintBox };
