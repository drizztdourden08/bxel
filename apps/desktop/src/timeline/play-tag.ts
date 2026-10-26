/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { goToFrame } from './go-to-frame';
import { selectTag } from './select-tag';
import { tagById } from './tag-by-id';
import { tagFrames } from './tag-frames';

const playTag = (tagId: string): void => {
  const target = currentTarget();
  const tag = tagById(tagId);
  const first = target && tag ? tagFrames(target.sprite, tag)[0] : undefined;
  if (!tag || first === undefined) return;
  selectTag(tag.id);
  goToFrame(first);
  useTimelineStore.getState().play();
};

export { playTag };
