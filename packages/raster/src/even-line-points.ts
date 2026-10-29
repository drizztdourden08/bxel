/* @layer core @kind logic */
import type { Corners, Point } from './geometry.type';

const evenLinePoints = ({ from, to }: Corners): Point[] => {
  const startX = Math.trunc(from.x);
  const startY = Math.trunc(from.y);
  const dx = Math.trunc(to.x) - startX;
  const dy = Math.trunc(to.y) - startY;
  const across = Math.abs(dx);
  const down = Math.abs(dy);
  const major = Math.max(across, down) + 1;
  const minor = Math.min(across, down) + 1;
  const stepX = dx < 0 ? -1 : 1;
  const stepY = dy < 0 ? -1 : 1;
  const points: Point[] = [];
  for (let at = 0; at < major; at++) {
    const side = Math.floor((at * minor) / major);
    points.push(across >= down ? { x: startX + at * stepX, y: startY + side * stepY } : { x: startX + side * stepX, y: startY + at * stepY });
  }
  return points;
};

export { evenLinePoints };
