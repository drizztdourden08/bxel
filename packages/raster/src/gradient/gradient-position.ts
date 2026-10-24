/* @layer core @kind logic */
import type { Corners } from '../geometry.type';

const gradientPosition = ({ from, to }: Corners, x: number, y: number): number => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = dx * dx + dy * dy;
  if (length === 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, ((x - from.x) * dx + (y - from.y) * dy) / length));
};

export { gradientPosition };
