/* @layer renderer-app @kind hook */
import { findSprite } from '@bxel/document';
import { useMemo } from 'react';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { openSprite } from '../../../timeline/open-sprite';
import { ownFrame } from '../../../timeline/own-frame';
import { sharedNote } from '../../../timeline/shared-note';
import { TIMELINE_LABEL } from '../../../timeline/timeline.constants';
import { FRAME_BAR_TEXT } from '../FrameBar.constants';
import type { FrameBarModel } from '../FrameBar.type';
import { spriteStep } from './sprite-step';

const useFrameBar = (): FrameBarModel | null => {
  const focus = useAnimationFocus();
  return useMemo(() => {
    if (!focus) return null;
    const { animation, frame, artwork } = focus;
    const sprite = frame.spriteId === null ? undefined : findSprite(artwork, frame.spriteId);
    const at = animation.frames.findIndex((each) => each.id === frame.id) + 1;
    const shared = sprite?.role === 'sprite';
    const note = shared ? sharedNote(focus) : null;
    return {
      path: [animation.name, FRAME_BAR_TEXT.frame(at, animation.frames.length), spriteStep(sprite)],
      notes: [...(shared ? [FRAME_BAR_TEXT.sharedHint] : []), ...(note === null ? [] : [note]), ...(frame.clip ? [FRAME_BAR_TEXT.clip] : [])],
      canOpen: shared,
      canCopy: shared,
      readOnly: focus.readOnly,
      open: () => void openSprite(),
      copy: () => void ownFrame(TIMELINE_LABEL.copy),
    };
  }, [focus]);
};

export { useFrameBar };
