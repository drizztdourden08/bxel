/* @layer core @kind logic */
import { channelOf } from './channel-of';
import { CHANNEL_MAX } from './oklab.constants';
import { LUMINANCE_WEIGHTS } from './palette-sort.constants';
import { srgbToLinear } from './srgb-to-linear';

const relativeLuminance = (rgb: number): number =>
  LUMINANCE_WEIGHTS.reduce((sum, weight, channel) => sum + weight * srgbToLinear(channelOf(rgb, channel) / CHANNEL_MAX), 0);

export { relativeLuminance };
