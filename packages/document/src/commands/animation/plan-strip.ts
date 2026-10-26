/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import { resolveRefId } from '../tilemap/resolve-ref-id';
import type { AnimationPlan } from './animation-plan.type';
import type { StripSource } from './anim-source.type';
import { buildAnimFrame } from './build-anim-frame';
import { checkFrameSprite } from './check-frame-sprite';
import { stripCells } from './strip-cells';

const planStrip = (draft: Draft, owner: string, source: StripSource): AnimationPlan => {
  const sprite = requireSprite(draft.artwork, resolveRefId<SpriteId>(draft, source.sprite, 'options.source.sprite'));
  checkFrameSprite(draft.artwork, { name: owner, bankId: sprite.bankId, frames: [] }, sprite.id, 'options.source.sprite');
  const cells = stripCells(sprite, source.grid, source.count, 'options.source.grid');
  const frames = cells.map((clip) => buildAnimFrame(draft.ids, { spriteId: sprite.id, clip }, { durationMs: source.durationMs }));
  const [first] = cells;
  return { width: first?.width ?? sprite.width, height: first?.height ?? sprite.height, bankId: sprite.bankId, frames };
};

export { planStrip };
