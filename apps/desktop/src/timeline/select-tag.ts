/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { selectFrameIds } from './select-frame-ids';
import { tagFrames } from './tag-frames';

const selectTag = (tagId: TagId): void => {
  const target = currentTarget();
  const tag = target?.sprite.tags.find((each) => each.id === tagId);
  if (!target || !tag) return;
  const frames = tagFrames(target.sprite, tag);
  useTimelineStore.getState().selectTag(tagId);
  selectFrameIds(target.layerId, frames, frames.includes(target.frameId) ? target.frameId : undefined);
};

export { selectTag };
