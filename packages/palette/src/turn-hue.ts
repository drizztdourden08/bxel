/* @layer core @kind logic */
import { FULL_TURN, HALF_TURN } from './oklab.constants';

const turnHue = (hue: number, toward: number, degrees: number): number => {
  const gap = ((toward - hue + FULL_TURN + HALF_TURN) % FULL_TURN) - HALF_TURN;
  const move = Math.sign(gap) * Math.min(Math.abs(gap), degrees);
  return (hue + move + FULL_TURN) % FULL_TURN;
};

export { turnHue };
