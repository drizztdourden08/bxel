/* @layer renderer-app @kind logic */
import type { TimelineSelection } from '../stores/timeline-store.type';
import { frameBadges } from './frame-badges';
import { BADGE_TEXT, TIMELINE_TEXT } from './timeline.constants';
import type { AnimationFocus, FrameCell } from './timeline.type';

const frameCells = (focus: AnimationFocus, selection: TimelineSelection): FrameCell[] =>
  focus.animation.frames.map((frame, index) => {
    const badges = frameBadges(focus.artwork, frame);
    return {
      id: frame.id,
      number: index + 1,
      durationMs: frame.durationMs,
      current: frame.id === focus.frame.id,
      selected: selection.frames.includes(frame.id),
      badges,
      label: TIMELINE_TEXT.frameLabel(index + 1, frame.durationMs, badges.map((badge) => BADGE_TEXT[badge].toLowerCase()).join(', ')),
    };
  });

export { frameCells };
