/* @layer renderer-app @kind logic */
import { activeTransform } from '../../../editor/transform/active-transform';
import { handlePoints } from '../../../editor/transform/handle-points';
import { pivotPoint } from '../../../editor/transform/pivot-point';
import { specQuad } from '../../../editor/transform/spec-quad';
import { transformBox } from '../../../editor/transform/transform-box';
import { useTransformUiStore } from '../../../stores/useTransformUiStore';
import type { PixelView } from '../../PixelViewport';
import { HANDLE_DRAW } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const paintTransform = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const active = activeTransform();
  const box = active ? transformBox(active.pending) : null;
  if (!active || !box) return;
  const { spec } = active;
  const quad = specQuad(box, spec);
  const pixel = 1 / view.zoom;
  const size = HANDLE_DRAW.size * pixel;
  const held = useTransformUiStore.getState().grab;
  ctx.save();
  ctx.lineWidth = pixel;
  ctx.beginPath();
  quad.forEach((corner, at) => (at === 0 ? ctx.moveTo(corner.x, corner.y) : ctx.lineTo(corner.x, corner.y)));
  ctx.closePath();
  ctx.strokeStyle = look.ground;
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.strokeStyle = look.ink;
  ctx.setLineDash([HANDLE_DRAW.dash * pixel, HANDLE_DRAW.dash * pixel]);
  ctx.stroke();
  ctx.setLineDash([]);
  for (const { handle, at } of handlePoints(quad)) {
    const lit = held?.kind === handle.kind && held.index === handle.index;
    ctx.fillStyle = lit ? look.cursor : look.ground;
    ctx.strokeStyle = look.ink;
    ctx.fillRect(at.x - size / 2, at.y - size / 2, size, size);
    ctx.strokeRect(at.x - size / 2, at.y - size / 2, size, size);
  }
  if (!spec.corners) {
    const pivot = pivotPoint(box, spec);
    const centre = { x: pivot.x + spec.offset.x, y: pivot.y + spec.offset.y };
    ctx.strokeStyle = look.axis;
    ctx.fillStyle = look.ground;
    ctx.beginPath();
    ctx.arc(centre.x, centre.y, HANDLE_DRAW.pivot * pixel, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centre.x - HANDLE_DRAW.cross * pixel, centre.y);
    ctx.lineTo(centre.x + HANDLE_DRAW.cross * pixel, centre.y);
    ctx.moveTo(centre.x, centre.y - HANDLE_DRAW.cross * pixel);
    ctx.lineTo(centre.x, centre.y + HANDLE_DRAW.cross * pixel);
    ctx.stroke();
  }
  ctx.restore();
};

export { paintTransform };
