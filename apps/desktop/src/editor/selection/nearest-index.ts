/* @layer renderer-app @kind logic */
import { CHANNELS } from './clip-codec.constants';

const gap = (table: Uint8Array, at: number, rgb: readonly [number, number, number]): number =>
  rgb.reduce((sum, value, channel) => sum + ((table[at * CHANNELS + channel] ?? 0) - value) ** 2, 0);

const nearestIndex = (table: Uint8Array, rgb: readonly [number, number, number]): number => {
  let best = 1;
  let bestGap = Number.POSITIVE_INFINITY;
  for (let at = 1; at < table.length / CHANNELS; at++) {
    const here = gap(table, at, rgb);
    if (here < bestGap) {
      best = at;
      bestGap = here;
    }
  }
  return best;
};

export { nearestIndex };
