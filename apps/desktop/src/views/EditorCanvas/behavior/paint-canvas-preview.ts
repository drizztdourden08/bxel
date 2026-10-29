/* @layer renderer-app @kind logic */
import { ANCHOR_HALVES } from '@bxel/raster';
import { useCanvasSizeStore } from '../../../stores/useCanvasSizeStore';
import type { PixelView } from '../../PixelViewport';
import { AXIS_DASH } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const paintCanvasPreview = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const { preview } = useCanvasSizeStore.getState();
  if (!preview) return;
  const halves = ANCHOR_HALVES[preview.anchor];
  const left = Math.floor(((view.imageWidth - preview.width) * halves.x) / 2);
  const top = Math.floor(((view.imageHeight - preview.height) * halves.y) / 2);
  const pixel = 1 / view.zoom;
  ctx.save();
  ctx.lineWidth = 2 * pixel;
  ctx.strokeStyle = look.ground;
  ctx.setLineDash([]);
  ctx.strokeRect(left, top, preview.width, preview.height);
  ctx.strokeStyle = look.cursor;
  ctx.setLineDash(AXIS_DASH.map((part) => part * pixel));
  ctx.strokeRect(left, top, preview.width, preview.height);
  ctx.restore();
};

export { paintCanvasPreview };
