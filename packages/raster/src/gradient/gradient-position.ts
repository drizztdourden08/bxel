/* @layer core @kind logic */
import type { Corners } from '../geometry.type';
import type { GradientShape } from './gradient.type';

const folded = (value: number): number => {
  const wave = ((value % 2) + 2) % 2;
  return wave <= 1 ? wave : 2 - wave;
};

const gradientPosition = ({ from, to }: Corners, x: number, y: number, shape: GradientShape = {}): number => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = dx * dx + dy * dy;
  if (length === 0) {
    return 0;
  }
  const raw = shape.kind === 'radial' ? Math.hypot(x - from.x, y - from.y) / Math.sqrt(length) : ((x - from.x) * dx + (y - from.y) * dy) / length;
  return shape.reflect === true ? folded(raw) : Math.min(1, Math.max(0, raw));
};

export { gradientPosition };
