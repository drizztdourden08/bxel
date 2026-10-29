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
  if (dx === 0 && dy === 0) return { to, label: '' };
  const reach = Math.hypot(dx, dy);
  let best: RatioSnap = { to, label: '' };
  let bestCos = -2;
  for (const [across, down] of CLEAN_RATIOS) {
    for (const [signX, signY] of SIGNS) {
      const ux = signX * across;
      const uy = signY * down;
      const dot = dx * ux + dy * uy;
      const cos = dot / (Math.hypot(ux, uy) * reach);
      if (cos > bestCos + 1e-9) {
        bestCos = cos;
        const steps = Math.max(1, Math.round(dot / (ux * ux + uy * uy)));
        best = { to: { x: from.x + ux * steps, y: from.y + uy * steps }, label: labelOf(across, down) };
      }
    }
  }
  return best;
};

export { ratioSnap };
