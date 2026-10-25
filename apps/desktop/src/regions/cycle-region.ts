/* @layer renderer-app @kind logic */
import { focusTarget } from './focus-target';
import { regionTargets } from './region-targets';

const cycleRegion = (step: 1 | -1): void => {
  const regions = regionTargets();
  if (regions.length === 0) return;
  const active = document.activeElement;
  const here = regions.findIndex((region) => active !== null && region.contains(active));
  const outside = step === 1 ? -1 : 0;
  const start = here === -1 ? outside : here;
  const next = regions[(start + step + regions.length) % regions.length];
  if (next) focusTarget(next)?.focus();
};

export { cycleRegion };
