/* @layer renderer-app @kind logic */
import type { ItemState, ItemStatus } from './project-browser.type';

const state = (status: ItemStatus, wanted: ItemState): boolean => {
  if (wanted === 'unsaved') return status.unsaved;
  if (wanted === 'open') return status.open;
  if (wanted === 'missing') return status.missing.length > 0;
  return status.unused;
};

const stateHolds = (status: ItemStatus, wanted: readonly ItemState[]): boolean => wanted.every((each) => state(status, each));

export { stateHolds };
