/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId, CommandStep } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { heldClip } from './frame-clip';
import type { ClipFrame } from './frame-clip.type';
import { idRef } from './id-ref';
import { moveFramesTo } from './move-frames-to';
import { selectFrameIds } from './select-frame-ids';
import { TIMELINE_LABEL, TIMELINE_REF, TIMELINE_TEXT } from './timeline.constants';
import type { AnimationFocus } from './timeline.type';

const fieldsOf = (frame: ClipFrame): object => ({
  durationMs: frame.durationMs,
  offset: frame.offset,
  ...(frame.pivot === null ? {} : { pivot: frame.pivot }),
});

const sourceOf = (frame: ClipFrame, same: boolean, linked: boolean): object | null => {
  if (frame.spriteId === null) return { kind: 'empty', count: 1 };
  if (!frame.owned) return { kind: 'sprite', sprite: frame.spriteId, mode: 'reference', ...(frame.clip ? { clip: frame.clip } : {}) };
  if (!same) return null;
  return linked ? { kind: 'sprite', sprite: frame.spriteId, mode: 'reference', ...(frame.clip ? { clip: frame.clip } : {}) } : { kind: 'duplicate', frame: idRef(frame.id) };
};

const pasteSteps = (focus: AnimationFocus, frames: readonly ClipFrame[], same: boolean, linked: boolean): CommandStep[] | null => {
  const at = focus.animation.frames.findIndex((frame) => frame.id === focus.frame.id) + 1;
  const steps: CommandStep[] = [];
  for (const [index, frame] of frames.entries()) {
    const source = sourceOf(frame, same, linked);
    if (source === null) return null;
    steps.push(animationStep(focus, COMMAND_NAME.animationFrameAdd, { source, at: at + index, ...(source && 'kind' in source && source.kind === 'duplicate' ? {} : fieldsOf(frame)) }, `${TIMELINE_REF.copy}${index}`));
  }
  return steps;
};

const pasteFrames = (linked = false): boolean => {
  const focus = currentFocus();
  const clip = heldClip();
  const post = useNoticeStore.getState().post;
  if (!focus) return false;
  if (!clip) {
    post(TIMELINE_TEXT.nothingCopied);
    return false;
  }
  if (clip.documentId !== focus.documentId) {
    post(TIMELINE_TEXT.otherFile);
    return false;
  }
  const same = clip.animationId === focus.animation.id;
  if (clip.cut) {
    if (!same) {
      post(TIMELINE_TEXT.cutElsewhere);
      return false;
    }
    const at = focus.animation.frames.findIndex((frame) => frame.id === focus.frame.id) + 1;
    const moving = clip.frames.map((frame) => frame.id);
    const before = focus.animation.frames.slice(0, at).filter((frame) => moving.includes(frame.id)).length;
    return moveFramesTo(at - before, moving);
  }
  const steps = pasteSteps(focus, clip.frames, same, linked);
  if (steps === null) {
    post(TIMELINE_TEXT.ownedElsewhere);
    return false;
  }
  const done = runDocument(TIMELINE_LABEL.paste, steps);
  if (!done) return false;
  selectFrameIds(clip.frames.flatMap((_, index) => done.created[`${TIMELINE_REF.copy}${index}`] ?? []) as AnimFrameId[]);
  return true;
};

export { pasteFrames };
