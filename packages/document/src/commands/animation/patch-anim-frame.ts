/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimFrame, Animation } from '../../model/animation.type';
import type { Rect } from '../../model/geometry.type';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import type { AnimationFrameUpdateOptions } from '../../schema/animation-options.type';
import { resolveRefId } from '../tilemap/resolve-ref-id';
import { checkClip } from './check-clip';
import { checkFrameSprite } from './check-frame-sprite';

const targetOf = (draft: Draft, frame: AnimFrame, options: AnimationFrameUpdateOptions): SpriteId | null => {
  if (options.sprite === undefined) return frame.spriteId;
  return options.sprite === null ? null : resolveRefId<SpriteId>(draft, options.sprite, 'options.sprite');
};

const clipOf = (frame: AnimFrame, spriteId: SpriteId | null, options: AnimationFrameUpdateOptions): Rect | null => {
  if (spriteId === null) return null;
  if (options.clip !== undefined) return options.clip;
  return spriteId === frame.spriteId ? frame.clip : null;
};

const patchAnimFrame = (draft: Draft, animation: Animation, frame: AnimFrame, options: AnimationFrameUpdateOptions): AnimFrame => {
  const spriteId = targetOf(draft, frame, options);
  const clip = clipOf(frame, spriteId, options);
  if (spriteId !== null) {
    checkFrameSprite(draft.artwork, animation, spriteId, 'options.sprite');
    if (clip) checkClip(requireSprite(draft.artwork, spriteId), clip, 'options.clip');
  }
  return {
    ...frame,
    spriteId,
    clip,
    durationMs: options.durationMs ?? frame.durationMs,
    offset: options.offset ?? frame.offset,
    pivot: options.pivot === undefined ? frame.pivot : options.pivot,
  };
};

export { patchAnimFrame };
