/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { Animation } from '../../model/animation.type';
import type { AnimationId } from '../../model/ids.type';
import { requireAnimation } from '../../read/require-animation';
import type { EntityRef } from '../../schema/entity-ref.type';
import { resolveRefId } from '../tilemap/resolve-ref-id';

const pickAnimation = (draft: Draft, ref: EntityRef<AnimationId>): Animation =>
  requireAnimation(draft.artwork, resolveRefId(draft, ref, 'options.animation'));

export { pickAnimation };
