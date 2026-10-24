/* @layer core @kind logic */
import type { GradientPick } from './gradient.type';

const gradientPick = ({ colors, position, threshold }: GradientPick): number => {
  const last = colors.length - 1;
  if (threshold === null) {
    return colors[Math.min(last, Math.floor(position * colors.length))] ?? 0;
  }
  const scaled = position * last;
  const lower = Math.min(last, Math.floor(scaled));
  const upper = Math.min(last, lower + 1);
  return colors[scaled - lower > threshold ? upper : lower] ?? 0;
};

export { gradientPick };
