/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';
import { SHADE_ALPHA } from '../TilemapCanvas.constants';
import type { BoxStyle } from '../TilemapCanvas.type';
import type { PixelView } from '../../PixelViewport';
import { applyStroke } from './apply-stroke';

const paintBox = (ctx: CanvasRenderingContext2D, view: PixelView, box: Rect, style: BoxStyle): void => {
  ctx.save();
  ctx.globalAlpha = SHADE_ALPHA;
  ctx.fillStyle = style.colour;
  ctx.fillRect(box.x, box.y, box.width, box.height);
  applyStroke(ctx, view, style);
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.restore();
};

export { paintBox };
