/* @layer renderer-app @kind logic */
import type { TimelineSelection } from '../stores/timeline-store.type';
import { frameBadges } from './frame-badges';
import { BADGE_TEXT, TIMELINE_TEXT } from './timeline.constants';
import type { AnimationFocus, FrameCell } from './timeline.type';

const sameSprite = (focus: AnimationFocus, left: number, right: number): boolean => {
  const a = focus.animation.frames[left]?.spriteId ?? null;
  return a !== null && a === (focus.animation.frames[right]?.spriteId ?? null);
};

const frameCells = (focus: AnimationFocus, selection: TimelineSelection): FrameCell[] => {
  const { frames } = focus.animation;
  return frames.map((frame, index) => {
    const badges = frameBadges(focus.artwork, frame);
    const linkedTo = index > 0 && sameSprite(focus, index - 1, index) ? index : null;
    const words = badges.filter((badge) => badge !== 'owned').map((badge) => BADGE_TEXT[badge].toLowerCase());
    if (linkedTo !== null) words.push(TIMELINE_TEXT.linkedTo(linkedTo));
    return {
      id: frame.id,
      number: index + 1,
      durationMs: frame.durationMs,
      current: frame.id === focus.frame.id,
      selected: selection.frames.includes(frame.id),
      badges,
      linkedTo,
      linkedNext: index < frames.length - 1 && sameSprite(focus, index, index + 1),
      label: TIMELINE_TEXT.frameLabel(index + 1, frames.length, frame.durationMs, words),
    };
  });
};

export { frameCells };
