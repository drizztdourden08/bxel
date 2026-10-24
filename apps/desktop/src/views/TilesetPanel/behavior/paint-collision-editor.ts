/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { COLLISION_VIEW } from '../../../tilemap/collision/collision.constants';
import { outlinePoints } from '../../../tilemap/collision/outline-points';
import type { CollisionPaint } from '../TilesetPanel.type';

const at = (point: Point, scale: number): Point => ({ x: COLLISION_VIEW.margin + point.x * scale, y: COLLISION_VIEW.margin + point.y * scale });

const paintCollisionEditor = (canvas: HTMLCanvasElement, paint: CollisionPaint): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { size, scale } = paint;
  canvas.width = size.width * scale + 2 * COLLISION_VIEW.margin;
  canvas.height = size.height * scale + 2 * COLLISION_VIEW.margin;
  ctx.imageSmoothingEnabled = false;
  if (paint.tile) ctx.drawImage(paint.tile, COLLISION_VIEW.margin, COLLISION_VIEW.margin, size.width * scale, size.height * scale);
  if (!paint.shape) return;
  const points = outlinePoints(paint.shape, size).map((point) => at(point, scale));
  ctx.beginPath();
  points.forEach((point, index) => (index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
  ctx.closePath();
  ctx.globalAlpha = COLLISION_VIEW.fill;
  ctx.fillStyle = paint.colour;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = paint.colour;
  ctx.lineWidth = COLLISION_VIEW.line;
  ctx.stroke();
  if (paint.shape.kind !== 'polygon') return;
  for (const point of points) ctx.fillRect(point.x - COLLISION_VIEW.handle, point.y - COLLISION_VIEW.handle, 2 * COLLISION_VIEW.handle, 2 * COLLISION_VIEW.handle);
};

export { paintCollisionEditor };
