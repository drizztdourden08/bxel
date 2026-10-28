/* @layer core @kind logic */
import { inGamut } from './in-gamut';
import { CHROMA_SEARCH_STEPS } from './oklab.constants';
import type { Oklch } from './oklab.type';
import { oklabToLinear } from './oklab-to-linear';
import { oklchToOklab } from './oklch-to-oklab';

const fits = (colour: Oklch): boolean => inGamut(oklabToLinear(oklchToOklab(colour)));

const clampOklch = (colour: Oklch): Oklch => {
  const l = Math.min(1, Math.max(0, colour.l));
  const wanted = { l, c: Math.max(0, colour.c), h: colour.h };
  if (fits(wanted)) return wanted;
  let low = 0;
  let high = wanted.c;
  for (let step = 0; step < CHROMA_SEARCH_STEPS; step += 1) {
    const middle = (low + high) / 2;
    if (fits({ ...wanted, c: middle })) low = middle;
    else high = middle;
  }
  return { ...wanted, c: low };
};

export { clampOklch };
