/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';

const bitAt = (mask: MaskView, x: number, y: number): boolean => x < mask.width && (mask.bits[y * mask.width + x] ?? 0) !== 0;

const rowRuns = (mask: MaskView, y: number): [number, number, number][] => {
  const runs: [number, number, number][] = [];
  let start = -1;
  for (let x = 0; x <= mask.width; x += 1) {
    const on = bitAt(mask, x, y);
    if (on && start < 0) start = x;
    if (!on && start >= 0) {
      runs.push([y, start, x - 1]);
      start = -1;
    }
  }
  return runs;
};

const runsOfMask = (mask: MaskView): [number, number, number][] => Array.from({ length: mask.height }, (_, y) => rowRuns(mask, y)).flat();

export { runsOfMask };
