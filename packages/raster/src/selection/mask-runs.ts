/* @layer core @kind logic */
import type { SavedRun } from '@bxel/document';
import type { MaskView } from '../buffer.type';

/** Row runs [y, x0, x1] with both ends inside, in reading order. */
const maskRuns = (mask: MaskView): SavedRun[] => {
  const runs: SavedRun[] = [];
  for (let y = 0; y < mask.height; y++) {
    let start = -1;
    for (let x = 0; x <= mask.width; x++) {
      const on = x < mask.width && (mask.bits[y * mask.width + x] ?? 0) !== 0;
      if (on && start < 0) start = x;
      if (!on && start >= 0) {
        runs.push([y, start, x - 1]);
        start = -1;
      }
    }
  }
  return runs;
};

export { maskRuns };
