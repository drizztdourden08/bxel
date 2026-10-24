/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { clearCels } from './clear-cels';
import { deletePickedTag } from './delete-picked-tag';

const deleteInZone = (): void => {
  const { zone } = useTimelineStore.getState();
  if (zone === 'cel') clearCels();
  else if (zone === 'tag') deletePickedTag();
};

export { deleteInZone };
