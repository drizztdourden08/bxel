/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimFrame, Animation } from '../../model/animation.type';
import type { AnimFrameId, SpriteId } from '../../model/ids.type';
import { findSprite } from '../../read/find-sprite';
import { cutFrameSprite } from './cut-frame-sprite';
import type { SplitResult } from './split-frames.type';

const splitFrames = (draft: Draft, animation: Animation, targets: ReadonlySet<AnimFrameId>): SplitResult => {
  const promoted = new Set<SpriteId>();
  const frames: AnimFrame[] = [];
  let made = 0;
  for (const frame of animation.frames) {
    const sprite = frame.spriteId === null || !targets.has(frame.id) ? undefined : findSprite(draft.artwork, frame.spriteId);
    if (sprite && frame.clip) {
      made += 1;
      frames.push({ ...frame, spriteId: cutFrameSprite(draft, animation.name, sprite, frame.clip).id, clip: null });
      continue;
    }
    if (sprite?.role === 'frame') promoted.add(sprite.id);
    frames.push(frame);
  }
  return { frames, promoted, made };
};

export { splitFrames };
