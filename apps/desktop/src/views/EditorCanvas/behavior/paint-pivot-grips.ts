/* @layer renderer-app @kind logic */
import { animFramePivot } from '@bxel/document';
import { currentTarget } from '../../../editor/current-target';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { canvasOrigin } from '../../../timeline/canvas-origin';
import type { PixelDraw } from '../../PixelViewport';
import { AXIS_DASH } from '../EditorCanvas.constants';
import { overlayLook } from './overlay-look';
import { paintAnchor } from './paint-anchor';
import { paintOnion } from './paint-onion';
import { paintPivot } from './paint-pivot';
import { pivotFrame } from './pivot-frame';

const paintPivotGrips: PixelDraw = (ctx, view) => {
  const target = currentTarget();
  const artwork = target ? useDocumentStore.getState().host.view(target.documentId)?.state.artwork : undefined;
  if (!target?.animation || !artwork) return;
  const { animation, frame } = target.animation;
  const look = overlayLook(ctx.canvas);
  const origin = canvasOrigin(artwork, animation, frame);
  const pixel = 1 / view.zoom;
  paintOnion(ctx);
  ctx.save();
  ctx.lineWidth = pixel;
  ctx.strokeStyle = look.ink;
  ctx.setLineDash(AXIS_DASH.map((part) => part * pixel));
  ctx.strokeRect(origin.x, origin.y, animation.width, animation.height);
  ctx.setLineDash([]);
  ctx.strokeStyle = look.cursor;
  paintAnchor(ctx, animation, origin, view.zoom);
  ctx.strokeStyle = look.axis;
  ctx.fillStyle = look.axis;
  paintPivot(ctx, view, pivotFrame(target), useTimelineStore.getState().pivotDraft ?? animFramePivot(artwork, animation, frame));
  ctx.restore();
};

export { paintPivotGrips };
