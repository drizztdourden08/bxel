/* @layer core @kind logic */
import type { Oklch } from './oklab.type';
import { RAMP_CHROMA_DROP, RAMP_HUE } from './ramp-build.constants';
import type { RampBuildOptions, RampSpan, StepShape } from './ramp-build.type';
import { turnHue } from './turn-hue';

const rampStepColour = (base: Oklch, shape: StepShape, options: Pick<RampBuildOptions, 'hueShift' | 'hueMode' | 'chromaCurve'>, span: RampSpan): Oklch => {
  const { offset, side, count } = shape;
  if (offset === 0 || count === 0) return base;
  const light = side > 0;
  const share = Math.abs(offset) / count;
  const end = light ? span.light : span.dark;
  const l = base.l + (end - base.l) * share;
  const drop = light ? RAMP_CHROMA_DROP.light : RAMP_CHROMA_DROP.dark;
  const c = options.chromaCurve ? base.c * (1 - drop * share * share) : base.c;
  const toward = light ? RAMP_HUE.warm : RAMP_HUE.cool;
  const h = options.hueMode === 'shift' ? turnHue(base.h, toward, options.hueShift * Math.abs(offset)) : base.h;
  return { l, c, h };
};

export { rampStepColour };
