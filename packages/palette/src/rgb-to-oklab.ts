/* @layer core @kind logic */
import { applyMatrix } from './apply-matrix';
import { channelOf } from './channel-of';
import { CHANNEL_MAX, LINEAR_TO_LMS, LMS_TO_OKLAB } from './oklab.constants';
import type { Oklab } from './oklab.type';
import { srgbToLinear } from './srgb-to-linear';

const linearOf = (rgb: number, channel: number): number => srgbToLinear(channelOf(rgb, channel) / CHANNEL_MAX);

const rgbToOklab = (rgb: number): Oklab => {
  const [l, m, s] = applyMatrix(LINEAR_TO_LMS, [linearOf(rgb, 0), linearOf(rgb, 1), linearOf(rgb, 2)]);
  const [lightness, a, b] = applyMatrix(LMS_TO_OKLAB, [Math.cbrt(l), Math.cbrt(m), Math.cbrt(s)]);
  return { l: lightness, a, b };
};

export { rgbToOklab };
