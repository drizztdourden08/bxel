/* @layer renderer-app @kind logic */
import { BRUSH_RESIZE_LABEL } from '../../../editor/brush-resize.constants';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelView } from '../../PixelViewport';
import { brushResizeDraft } from './brush-resize-draft';
import type { OverlayLook } from './canvas-tools.type';

const paintBrushResize = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const draft = brushResizeDraft.current;
  if (!draft) return;
  const size = useToolStore.getState().brushSize;
  const offset = Math.floor((size - 1) / 2);
  ctx.save();
  ctx.strokeStyle = look.cursor;
  ctx.lineWidth = 1 / view.zoom;
  ctx.strokeRect(draft.at.x - offset, draft.at.y - offset, size, size);
  ctx.fillStyle = look.cursor;
  ctx.font = `${12 / view.zoom}px sans-serif`;
  ctx.fillText(BRUSH_RESIZE_LABEL(size), draft.at.x - offset, draft.at.y - offset - 3 / view.zoom);
  ctx.restore();
};

export { paintBrushResize };
