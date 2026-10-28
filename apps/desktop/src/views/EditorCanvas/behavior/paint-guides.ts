/* @layer renderer-app @kind logic */
import { guideScope } from '../../../guides/guide-scope';
import { useGuideStore } from '../../../stores/useGuideStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelView } from '../../PixelViewport';
import { GUIDE_ALPHA } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';
import { shownGuides } from './shown-guides';

const paintGuides = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const lines = guideScope()?.lines();
  const drag = useGuideStore.getState().drag;
  if (!useViewStore.getState().guides && !drag) return;
  const { x, y } = shownGuides(lines, drag);
  if (x.length + y.length === 0) return;
  ctx.save();
  ctx.strokeStyle = look.guide;
  ctx.globalAlpha = GUIDE_ALPHA;
  ctx.lineWidth = 1 / view.zoom;
  ctx.beginPath();
  for (const at of x) {
    ctx.moveTo(at, 0);
    ctx.lineTo(at, view.imageHeight);
  }
  for (const at of y) {
    ctx.moveTo(0, at);
    ctx.lineTo(view.imageWidth, at);
  }
  ctx.stroke();
  ctx.restore();
};

export { paintGuides };
