/* @layer core @kind logic */
import type { Oklab } from './oklab.type';
import { oklabDistance } from './oklab-distance';
import { parseHex } from './parse-hex';
import type { RampSwatch } from './ramp-build.type';
import { rgbToOklab } from './rgb-to-oklab';

const nearestSwatch = (colour: Oklab, swatches: readonly RampSwatch[], within: number): RampSwatch | null => {
  let best: RampSwatch | null = null;
  let bestDistance = within;
  for (const swatch of swatches) {
    const rgb = parseHex(swatch.hex.slice(0, 7));
    if (rgb === null) continue;
    const distance = oklabDistance(colour, rgbToOklab(rgb));
    if (distance <= bestDistance) {
      best = swatch;
      bestDistance = distance;
    }
  }
  return best;
};

export { nearestSwatch };
