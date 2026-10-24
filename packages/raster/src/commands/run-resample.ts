/* @layer core @kind logic */
import { addWarning } from '@bxel/document';
import type { CommandInput, Draft } from '@bxel/document';
import { applyPlan } from './apply-plan';
import { checkPlans } from './check-plans';
import { checkTargets } from './check-targets';
import { planSprite } from './plan-sprite';
import type { ResampleSpec } from './resample.type';
import { PIXELS_CLIPPED } from './transform-commands.constants';

const runResample = (draft: Draft, input: CommandInput, spec: ResampleSpec): void => {
  checkTargets({ project: draft.project, sprites: input.sprites, index: 0, mask: spec.mask });
  const plans = input.sprites.map((spriteId) => planSprite(draft.project, spriteId, spec));
  checkPlans(plans, spec.bounds);
  let clipped = 0;
  for (const plan of plans) {
    clipped = Math.max(clipped, applyPlan(draft, input.cels, plan, spec));
  }
  if (clipped > 0) {
    addWarning(draft, PIXELS_CLIPPED, `${clipped} masked pixel(s) moved outside the sprite and were dropped.`);
  }
};

export { runResample };
