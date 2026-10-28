/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { CLEAN_RATIOS, SIGNS } from './ratio-snap.constants';
import type { RatioSnap } from './ratio-snap.type';

const labelOf = (across: number, down: number): string => {
  if (down === 0) return 'Horizontal';
  return across === 0 ? 'Vertical' : `${across}:${down}`;
};

const ratioSnap = (from: Point, to: Point): RatioSnap => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  let best: RatioSnap = { to, label: '' };
  let bestError = Number.POSITIVE_INFINITY;
  for (const [across, down] of CLEAN_RATIOS) {
    for (const [signX, signY] of SIGNS) {
      const run = (dx * signX * across + dy * signY * down) / (across * across + down * down);
      const steps = Math.max(1, Math.round(run));
      const end = { x: from.x + signX * across * steps, y: from.y + signY * down * steps };
      const error = (end.x - to.x) ** 2 + (end.y - to.y) ** 2;
      if (run > 0 && error < bestError) {
        bestError = error;
        best = { to: end, label: labelOf(across, down) };
      }
    }
  }
  return dx === 0 && dy === 0 ? { to, label: '' } : best;
};

export { ratioSnap };
