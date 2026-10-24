/* @layer core @kind logic */
import { addWarning } from '@bxel/document';
import type { Draft, Ramp, SwatchId } from '@bxel/document';
import { WARNING_CODE } from './palette-warning.constants';
import { MIN_RAMP_SWATCHES } from './ramp-limits.constants';
import type { RampChanges } from './rewrite-ramps.type';

const rewriteRamp = (ramp: Ramp, changes: RampChanges): Ramp => {
  const mapped = ramp.swatches.flatMap((id): SwatchId[] => {
    const next = changes.has(id) ? (changes.get(id) ?? null) : id;
    return next === null ? [] : [next];
  });
  const swatches = mapped.filter((id, at) => mapped.indexOf(id) === at);
  const same = swatches.length === ramp.swatches.length && swatches.every((id, at) => id === ramp.swatches[at]);
  return same ? ramp : { ...ramp, swatches };
};

const rewriteRamps = (draft: Draft, ramps: readonly Ramp[], changes: RampChanges): Ramp[] => {
  const rewritten = ramps.map((ramp) => rewriteRamp(ramp, changes));
  for (const ramp of rewritten.filter((item) => item.swatches.length < MIN_RAMP_SWATCHES)) {
    addWarning(draft, WARNING_CODE.RAMP_DROPPED, `Ramp "${ramp.name}" kept fewer than ${MIN_RAMP_SWATCHES} swatches and was removed.`);
  }
  return rewritten.filter((ramp) => ramp.swatches.length >= MIN_RAMP_SWATCHES);
};

export { rewriteRamps };
