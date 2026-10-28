/* @layer core @kind logic */
import { defaultRampSpan } from './default-ramp-span';
import { hexToOklch } from './hex-to-oklch';
import { nearestSwatch } from './nearest-swatch';
import type { Oklch } from './oklab.type';
import { oklchToHex } from './oklch-to-hex';
import { oklchToOklab } from './oklch-to-oklab';
import { RAMP_LIMITS } from './ramp-build.constants';
import type { RampBuild, RampBuildOptions, RampStep } from './ramp-build.type';
import { rampStepColour } from './ramp-step-colour';

const sideCount = (value: number): number => Math.max(0, Math.min(RAMP_LIMITS.maxSide, Math.round(value)));

const stepOf = (offset: number, hex: string, reuses: number | null): RampStep => {
  const { l, c, h } = hexToOklch(hex) ?? { l: 0, c: 0, h: 0 };
  return { offset, hex, l, c, h, reuses };
};

const snapStep = (options: RampBuildOptions, taken: Set<number>, offset: number, wanted: Oklch): RampStep => {
  const free = options.existing.filter((swatch) => !taken.has(swatch.index));
  const near = options.snap > 0 ? nearestSwatch(oklchToOklab(wanted), free, options.snap) : null;
  if (!near) return stepOf(offset, oklchToHex(wanted), null);
  taken.add(near.index);
  return stepOf(offset, near.hex.slice(0, 7).toLowerCase(), near.index);
};

const buildRamp = (options: RampBuildOptions): RampBuild | null => {
  const base = hexToOklch(options.base);
  if (!base) return null;
  const dark = sideCount(options.dark);
  const light = sideCount(options.light);
  const span = options.span ?? defaultRampSpan(base.l);
  const baseIndex = options.baseIndex ?? null;
  const taken = new Set<number>(baseIndex === null ? [] : [baseIndex]);
  const offsets = Array.from({ length: dark + light + 1 }, (_, at) => at - dark);
  const steps = offsets.map((offset): RampStep => {
    if (offset === 0) return baseIndex === null ? snapStep(options, taken, 0, base) : stepOf(0, options.base.slice(0, 7).toLowerCase(), baseIndex);
    const shape = { offset, side: Math.sign(offset), count: offset < 0 ? dark : light };
    return snapStep(options, taken, offset, rampStepColour(base, shape, options, span));
  });
  return { steps, added: steps.filter((step) => step.reuses === null).length, span };
};

export { buildRamp };
