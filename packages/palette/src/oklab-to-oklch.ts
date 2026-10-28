/* @layer core @kind logic */
import { FULL_TURN, HALF_TURN } from './oklab.constants';
import type { Oklab, Oklch } from './oklab.type';

const oklabToOklch = ({ l, a, b }: Oklab): Oklch => {
  const degrees = (Math.atan2(b, a) * HALF_TURN) / Math.PI;
  return { l, c: Math.hypot(a, b), h: (degrees + FULL_TURN) % FULL_TURN };
};

export { oklabToOklch };
