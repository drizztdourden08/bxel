/* @layer renderer-app @kind logic */
import { gradientOriginShown } from '../../../editor/gradient-origin-shown';
import { ORIGIN_ARM } from '../../../editor/gradient-origin.constants';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { PixelView } from '../../PixelViewport';
import type { OverlayLook } from './canvas-tools.type';

const paintGradientOrigin = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  if (!gradientOriginShown()) return;
  const { gradientOriginX: x, gradientOriginY: y } = useDrawingStore.getState();
  const arm = ORIGIN_ARM / view.zoom;
  ctx.save();
  ctx.strokeStyle = look.cursor;
  ctx.lineWidth = 2 / view.zoom;
  ctx.beginPath();
  ctx.moveTo(x - arm, y);
  ctx.lineTo(x + arm, y);
  ctx.moveTo(x, y - arm);
  ctx.lineTo(x, y + arm);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, arm / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
};

export { paintGradientOrigin };
