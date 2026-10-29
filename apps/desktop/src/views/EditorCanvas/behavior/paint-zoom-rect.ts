/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import { ZOOM_RECT_DASH } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';
import { zoomDraft } from './zoom-draft';
import { zoomRectOf } from './zoom-rect-of';

const paintZoomRect = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const draft = zoomDraft.current;
  if (!draft) return;
  const rect = zoomRectOf(draft);
  ctx.save();
  ctx.strokeStyle = look.cursor;
  ctx.lineWidth = 1 / view.zoom;
  ctx.setLineDash(ZOOM_RECT_DASH.map((part) => part / view.zoom));
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  ctx.restore();
};

export { paintZoomRect };
