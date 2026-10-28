/* @layer core @kind logic */
import { RAMP_SPAN } from './ramp-build.constants';
import type { RampSpan } from './ramp-build.type';

const defaultRampSpan = (baseLightness: number): RampSpan => ({
  dark: baseLightness * RAMP_SPAN.darkShare,
  light: baseLightness + (RAMP_SPAN.lightTop - baseLightness) * RAMP_SPAN.lightShare,
});

export { defaultRampSpan };
