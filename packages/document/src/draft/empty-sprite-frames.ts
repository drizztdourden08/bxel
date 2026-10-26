/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { SpriteId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const emptied = (animation: Animation, gone: ReadonlySet<SpriteId>): Animation =>
  animation.frames.some((frame) => frame.spriteId !== null && gone.has(frame.spriteId))
    ? {
        ...animation,
        frames: animation.frames.map((frame) =>
          frame.spriteId !== null && gone.has(frame.spriteId) ? { ...frame, spriteId: null, clip: null } : frame,
        ),
      }
    : animation;

const emptySpriteFrames = (draft: Draft, gone: ReadonlySet<SpriteId>): number => {
  const count = draft.artwork.animations.reduce(
    (total, animation) => total + animation.frames.filter((frame) => frame.spriteId !== null && gone.has(frame.spriteId)).length,
    0,
  );
  if (count > 0) updateArtwork(draft, (artwork) => ({ ...artwork, animations: artwork.animations.map((item) => emptied(item, gone)) }));
  return count;
};

export { emptySpriteFrames };
