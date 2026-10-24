/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { deleteTag } from './delete-tag';

const deletePickedTag = (): boolean => {
  const { tagId } = useTimelineStore.getState();
  return tagId !== null && deleteTag(tagId);
};

export { deletePickedTag };
