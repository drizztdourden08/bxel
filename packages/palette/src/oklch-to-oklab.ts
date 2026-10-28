/* @layer core @kind logic */
import { HALF_TURN } from './oklab.constants';
import type { Oklab, Oklch } from './oklab.type';

const oklchToOklab = ({ l, c, h }: Oklch): Oklab => {
  const radians = (h * Math.PI) / HALF_TURN;
  return { l, a: c * Math.cos(radians), b: c * Math.sin(radians) };
};

export { oklchToOklab };
