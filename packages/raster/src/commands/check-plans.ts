/* @layer core @kind logic */
import { ERROR_CODE, MAX_SPRITE_SIZE, fail } from '@bxel/document';
import type { TargetIssue } from '@bxel/document';
import { areaInside } from '../region/area-inside';
import type { BoundsPolicy } from '../region/region.type';
import type { SpritePlan } from './resample.type';
import { targetIssue } from './target-issue';

const issuesOf = (plans: readonly SpritePlan[], reason: string, test: (plan: SpritePlan) => boolean): TargetIssue[] =>
  plans.filter(test).map((plan) => targetIssue(plan.spriteId, reason));

const checkPlans = (plans: readonly SpritePlan[], bounds: BoundsPolicy): void => {
  const oversized = issuesOf(
    plans,
    `the result is wider or taller than ${MAX_SPRITE_SIZE} pixels`,
    (plan) => (plan.area?.width ?? 0) > MAX_SPRITE_SIZE || (plan.area?.height ?? 0) > MAX_SPRITE_SIZE,
  );
  if (oversized.length > 0) {
    throw fail(ERROR_CODE.SIZE_OUT_OF_RANGE, `The result must stay within ${MAX_SPRITE_SIZE} pixels on each side.`, {
      details: oversized,
    });
  }
  const outside = issuesOf(plans, 'the result reaches outside the sprite', (plan) => plan.area !== null && !areaInside(plan.size, plan.area));
  if (bounds === 'cancel' && outside.length > 0) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, 'The result would leave the sprite, and the bounds policy is cancel.', {
      details: outside,
    });
  }
};

export { checkPlans };
