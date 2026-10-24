/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { PixelView } from '../../PixelViewport';
import type { OverlayLook } from './canvas-tools.type';

const paintPolygon = (ctx: CanvasRenderingContext2D, view: PixelView, path: readonly Point[], look: OverlayLook): void => {
  const first = path[0];
  if (!first) return;
  ctx.save();
  ctx.lineWidth = 1 / view.zoom;
  ctx.strokeStyle = look.ink;
  ctx.fillStyle = look.ink;
  ctx.beginPath();
  ctx.moveTo(first.x + 0.5, first.y + 0.5);
  for (const point of path.slice(1)) ctx.lineTo(point.x + 0.5, point.y + 0.5);
  ctx.stroke();
  for (const point of path) ctx.fillRect(point.x + 0.25, point.y + 0.25, 0.5, 0.5);
  ctx.restore();
};

export { paintPolygon };
