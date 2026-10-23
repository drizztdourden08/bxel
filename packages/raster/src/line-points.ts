/* @layer core @kind logic */
import type { Corners, Point } from './geometry.type';

const linePoints = ({ from, to }: Corners): Point[] => {
  const startX = Math.trunc(from.x);
  const startY = Math.trunc(from.y);
  const endX = Math.trunc(to.x);
  const endY = Math.trunc(to.y);
  const dx = Math.abs(endX - startX);
  const dy = -Math.abs(endY - startY);
  const stepX = startX < endX ? 1 : -1;
  const stepY = startY < endY ? 1 : -1;
  const points: Point[] = [{ x: startX, y: startY }];
  let x = startX;
  let y = startY;
  let err = dx + dy;
  while (x !== endX || y !== endY) {
    const doubled = 2 * err;
    if (doubled >= dy) {
      err += dy;
      x += stepX;
    }
    if (doubled <= dx) {
      err += dx;
      y += stepY;
    }
    points.push({ x, y });
  }
  return points;
};

export { linePoints };
