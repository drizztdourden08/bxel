/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { clampIndex } from './clamp-index';
import { selectTag } from './select-tag';

const stepTag = (delta: number): void => {
  const target = currentTarget();
  if (!target) return;
  const { tags } = target.sprite;
  const index = tags.findIndex((tag) => tag.id === useTimelineStore.getState().tagId);
  const next = tags[clampIndex(index < 0 ? 0 : index + delta, tags.length)];
  if (next) selectTag(next.id);
};

export { stepTag };
