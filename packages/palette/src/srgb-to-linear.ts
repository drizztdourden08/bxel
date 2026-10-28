/* @layer core @kind logic */
import { SRGB_GAMMA } from './oklab.constants';

const srgbToLinear = (unit: number): number =>
  unit <= SRGB_GAMMA.knee ? unit / SRGB_GAMMA.slope : ((unit + SRGB_GAMMA.offset) / (1 + SRGB_GAMMA.offset)) ** SRGB_GAMMA.power;

export { srgbToLinear };
