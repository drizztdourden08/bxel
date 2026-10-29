/* @layer core @kind logic */
import type { Draft, ResolvedCel } from '@bxel/document';
import { areaInside } from '../region/area-inside';
import { landRegion } from '../region/land-region';
import { shiftView } from '../region/shift-view';
import { unionFrame } from '../region/union-frame';
import { applyToCels } from './apply-to-cels';
import { growSprite } from './grow-sprite';
import type { ResampleSpec, SpritePlan, Tally } from './resample.type';
import { spriteCels } from './sprite-cels';

const applyPlan = (draft: Draft, cels: readonly ResolvedCel[], plan: SpritePlan, spec: ResampleSpec): Tally => {
  if (!plan.area) {
    return { clipped: 0, added: null };
  }
  let view = plan.view;
  if (spec.bounds === 'expand' && !areaInside(plan.size, plan.area)) {
    const frame = unionFrame(plan.size, plan.area);
    growSprite(draft, plan.spriteId, frame);
    view = shiftView(view, frame);
  }
  const resample = spec.mover(view);
  let clipped = 0;
  let added: number | null = null;
  applyToCels(draft, spriteCels(cels, plan.spriteId), (target) => {
    const result = landRegion({ target, mask: view.mask, resample, skipZero: spec.skipZero });
    clipped = Math.max(clipped, result.clipped);
    added = result.added === null ? added : Math.max(added ?? 0, result.added);
    return result.rect;
  });
  return { clipped, added };
};

export { applyPlan };
