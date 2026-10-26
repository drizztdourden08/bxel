/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimFrame, Animation } from '../../model/animation.type';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import { resolveRefId } from '../tilemap/resolve-ref-id';
import type { SpriteFrameSource } from './anim-source.type';
import { buildAnimFrame } from './build-anim-frame';
import type { FrameFields } from './build-anim-frame.type';
import { checkClip } from './check-clip';
import { checkFrameSprite } from './check-frame-sprite';
import { ownedCopy } from './owned-copy';

const spriteFrames = (draft: Draft, animation: Animation, source: SpriteFrameSource, fields: FrameFields): AnimFrame[] => {
  const id = resolveRefId<SpriteId>(draft, source.sprite, 'options.source.sprite');
  checkFrameSprite(draft.artwork, animation, id, 'options.source.sprite');
  const sprite = requireSprite(draft.artwork, id);
  if (source.clip) checkClip(sprite, source.clip, 'options.source.clip');
  const used = source.mode === 'copy' && sprite.role === 'sprite' ? ownedCopy(draft, animation.name, sprite) : sprite;
  return [buildAnimFrame(draft.ids, { spriteId: used.id, clip: source.clip ?? null }, fields)];
};

export { spriteFrames };
