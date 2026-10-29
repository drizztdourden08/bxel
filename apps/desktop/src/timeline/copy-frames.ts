/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { holdClip } from './hold-clip';
import type { ClipFrame } from './frame-clip.type';

const copyFrames = (cut = false): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const picked = currentSelection(focus);
  const frames = focus.animation.frames.filter((frame) => picked.includes(frame.id));
  const snapshot: ClipFrame[] = frames.map((frame) => ({
    id: frame.id,
    spriteId: frame.spriteId,
    owned: frame.spriteId !== null && findSprite(focus.artwork, frame.spriteId)?.role === 'frame',
    clip: frame.clip,
    durationMs: frame.durationMs,
    offset: frame.offset,
    pivot: frame.pivot,
  }));
  holdClip({ documentId: focus.documentId, animationId: focus.animation.id, frames: snapshot, cut });
  return snapshot.length > 0;
};

export { copyFrames };
