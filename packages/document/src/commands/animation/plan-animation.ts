/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimSourceOptions } from '../../schema/animation-options.type';
import type { AnimationPlan } from './animation-plan.type';
import { planBlank } from './plan-blank';
import { planSprites } from './plan-sprites';
import { planStrip } from './plan-strip';

const planAnimation = (draft: Draft, owner: string, source: AnimSourceOptions): AnimationPlan => {
  switch (source.kind) {
    case 'blank':
      return planBlank(draft, source);
    case 'sprites':
      return planSprites(draft, source.sprites, { owner, mode: source.mode, durationMs: source.durationMs });
    case 'sprite':
      return planSprites(draft, [source.sprite], { owner, mode: source.mode, durationMs: source.durationMs });
    case 'strip':
      return planStrip(draft, owner, source);
  }
};

export { planAnimation };
