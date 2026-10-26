/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import type { EntityRef } from '../../schema/entity-ref.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { resolveRefId } from '../tilemap/resolve-ref-id';
import type { AnimationPlan } from './animation-plan.type';
import { buildAnimFrame } from './build-anim-frame';
import { checkFrameSprite } from './check-frame-sprite';
import { ownedCopy } from './owned-copy';
import type { SpriteListing } from './plan-sprites.type';

const planSprites = (draft: Draft, refs: readonly EntityRef<SpriteId>[], listing: SpriteListing): AnimationPlan => {
  const sprites = refs.map((ref, index) =>
    requireSprite(draft.artwork, resolveRefId<SpriteId>(draft, ref, `options.source.sprites.${index}`)),
  );
  const [first] = sprites;
  if (!first) throw fail(ERROR_CODE.INVALID_OPTION, 'Give at least one sprite.', { path: 'options.source.sprites' });
  const stub = { name: listing.owner, bankId: first.bankId, frames: [] };
  const frames = sprites.map((sprite, index) => {
    checkFrameSprite(draft.artwork, stub, sprite.id, `options.source.sprites.${index}`);
    const used = listing.mode === 'copy' ? ownedCopy(draft, listing.owner, sprite) : sprite;
    return buildAnimFrame(draft.ids, { spriteId: used.id }, { durationMs: listing.durationMs });
  });
  return {
    width: Math.max(...sprites.map((sprite) => sprite.width)),
    height: Math.max(...sprites.map((sprite) => sprite.height)),
    bankId: first.bankId,
    frames,
  };
};

export { planSprites };
