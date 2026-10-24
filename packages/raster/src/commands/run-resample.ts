/* @layer core @kind logic */
import { addReport, addWarning } from '@bxel/document';
import type { CommandInput, Draft } from '@bxel/document';
import { applyPlan } from './apply-plan';
import { checkPlans } from './check-plans';
import { checkTargets } from './check-targets';
import { planSprite } from './plan-sprite';
import type { ResampleSpec } from './resample.type';
import { REPORT_KEY } from './report-key.constants';
import { PIXELS_CLIPPED } from './transform-commands.constants';

const runResample = (draft: Draft, input: CommandInput, spec: ResampleSpec): void => {
  checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: 0, mask: spec.mask });
  const plans = input.sprites.map((spriteId) => planSprite(draft.artwork, spriteId, spec));
  checkPlans(plans, spec.bounds);
  let clipped = 0;
  for (const plan of plans) {
    clipped = Math.max(clipped, applyPlan(draft, input.cels, plan, spec));
  }
  if (clipped > 0) {
    addReport(draft, REPORT_KEY.pixelsClipped, clipped);
    addWarning(draft, PIXELS_CLIPPED, `${clipped} masked pixel(s) moved outside the sprite and were dropped.`);
  }
};

export { runResample };
