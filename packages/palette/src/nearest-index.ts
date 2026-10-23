/* @layer core @kind logic */
import { colorDistance } from './color-distance';

const nearestIndex = (rgb: number, table: Int32Array): number => {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const [slot, candidate] of table.entries()) {
    if (candidate < 0) continue;
    const distance = colorDistance(rgb, candidate);
    if (distance < bestDistance) {
      best = slot;
      bestDistance = distance;
      if (distance === 0) break;
    }
  }
  return best;
};

export { nearestIndex };
