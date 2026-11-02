/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { TagId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { goToFrame } from './go-to-frame';
import { playSteps } from './play-steps';
import { selectTag } from './select-tag';
import { tagById } from './tag-by-id';
import { TIMELINE_SAY } from './timeline-say.constants';

const playTag = (tagId: TagId): void => {
  const focus = currentFocus();
  const tag = focus ? tagById(focus.animation, tagId) : undefined;
  if (!focus || !tag) return;
  const first = playSteps(focus.animation, tag.id).steps[0];
  if (!first) return;
  selectTag(tag.id);
  goToFrame(first.frameId);
  useTimelineStore.getState().play();
  announce(TIMELINE_SAY.playingTag(tag.name));
};

export { playTag };
