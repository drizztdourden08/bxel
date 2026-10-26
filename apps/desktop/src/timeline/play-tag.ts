/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { goToFrame } from './go-to-frame';
import { playSteps } from './play-steps';
import { selectTag } from './select-tag';
import { tagById } from './tag-by-id';

const playTag = (tagId: TagId): void => {
  const focus = currentFocus();
  const tag = focus ? tagById(focus.animation, tagId) : undefined;
  if (!focus || !tag) return;
  const first = playSteps(focus.animation, tag.id).steps[0];
  if (!first) return;
  selectTag(tag.id);
  goToFrame(first.frameId);
  useTimelineStore.getState().play();
};

export { playTag };
