/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import type { PixelView } from '../../PixelViewport';
import { ANT_DASH } from '../EditorCanvas.constants';
import { antPhase } from './ant-phase';
import type { OverlayLook } from './canvas-tools.type';
import { outlinePath } from './outline-path';

const strokeOutline = (ctx: CanvasRenderingContext2D, view: PixelView, mask: MaskView, look: OverlayLook): void => {
  const path = outlinePath(mask);
  const dash = ANT_DASH / view.zoom;
  ctx.save();
  ctx.lineWidth = 1 / view.zoom;
  ctx.setLineDash([]);
  ctx.strokeStyle = look.ground;
  ctx.stroke(path);
  ctx.setLineDash([dash, dash]);
  ctx.lineDashOffset = -antPhase(ctx.canvas) / view.zoom;
  ctx.strokeStyle = look.ink;
  ctx.stroke(path);
  ctx.restore();
};

export { strokeOutline };
