/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimFrame, Animation } from '../../model/animation.type';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import { resolveRefId } from '../tilemap/resolve-ref-id';
import type { StripFrameSource } from './anim-source.type';
import { buildAnimFrame } from './build-anim-frame';
import type { FrameFields } from './build-anim-frame.type';
import { checkFrameSprite } from './check-frame-sprite';
import { stripCells } from './strip-cells';

const stripFrames = (draft: Draft, animation: Animation, source: StripFrameSource, fields: FrameFields): AnimFrame[] => {
  const id = resolveRefId<SpriteId>(draft, source.sprite, 'options.source.sprite');
  checkFrameSprite(draft.artwork, animation, id, 'options.source.sprite');
  const sprite = requireSprite(draft.artwork, id);
  const cells = stripCells(sprite, source.grid, source.count, 'options.source.grid');
  return cells.map((clip) => buildAnimFrame(draft.ids, { spriteId: sprite.id, clip }, fields));
};

export { stripFrames };
