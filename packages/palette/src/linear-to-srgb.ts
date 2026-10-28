/* @layer core @kind logic */
import { SRGB_GAMMA } from './oklab.constants';

const linearToSrgb = (linear: number): number =>
  linear <= SRGB_GAMMA.linearKnee ? linear * SRGB_GAMMA.slope : (1 + SRGB_GAMMA.offset) * linear ** (1 / SRGB_GAMMA.power) - SRGB_GAMMA.offset;

export { linearToSrgb };
