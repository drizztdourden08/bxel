/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { currentFocus } from '../../../timeline/current-focus';
import { currentSelection } from '../../../timeline/current-selection';
import { TIMELINE_MENU } from './timeline-menu.constants';

const timelineMenuSelection = ({ target }: { target: Element }): Iterable<string> => {
  const tag = target.closest<HTMLElement>(TIMELINE_MENU.tag)?.dataset.tagId;
  if (tag !== undefined) return [tag];
  const frame = target.closest<HTMLElement>(TIMELINE_MENU.frame)?.dataset.frameId as AnimFrameId | undefined;
  const focus = currentFocus();
  if (frame === undefined || !focus) return [];
  const picked = currentSelection(focus);
  return picked.includes(frame) ? picked : [frame];
};

export { timelineMenuSelection };
