/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import { sharedNote } from '../timeline/shared-note';
import type { AnimationFocus } from '../timeline/timeline.type';
import type { AnimationHeader } from './stage-header.type';

const readAnimationHeader = (focus: AnimationFocus): AnimationHeader => {
  const { animation, frame, artwork } = focus;
  const sprite = frame.spriteId === null ? undefined : findSprite(artwork, frame.spriteId);
  const shared = sprite?.role === 'sprite';
  const note = shared ? sharedNote(focus) : null;
  return {
    name: animation.name,
    frameAt: animation.frames.findIndex((each) => each.id === frame.id) + 1,
    frameCount: animation.frames.length,
    spriteName: sprite?.name ?? null,
    shared,
    notes: note === null ? [] : [note],
    clip: Boolean(frame.clip),
  };
};

export { readAnimationHeader };
