/* @layer core @kind logic */
import { clampOklch } from './clamp-oklch';
import { linearToSrgb } from './linear-to-srgb';
import { CHANNEL_MAX } from './oklab.constants';
import type { Oklch } from './oklab.type';
import { oklabToLinear } from './oklab-to-linear';
import { oklchToOklab } from './oklch-to-oklab';
import { packRgb } from './pack-rgb';

const toByte = (linear: number): number => Math.round(Math.min(1, Math.max(0, linearToSrgb(Math.max(0, linear)))) * CHANNEL_MAX);

const oklchToRgb = (colour: Oklch): number => {
  const [r, g, b] = oklabToLinear(oklchToOklab(clampOklch(colour)));
  return packRgb(toByte(r), toByte(g), toByte(b));
};

export { oklchToRgb };
