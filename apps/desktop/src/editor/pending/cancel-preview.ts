/* @layer renderer-app @kind logic */
import { usePendingStore } from '../../stores/usePendingStore';
import { cancelPolygon } from '../selection/cancel-polygon';
import { cancelPending } from './cancel-pending';

const cancelPreview = (): boolean => {
  if (cancelPolygon()) return true;
  const open = usePendingStore.getState().pending !== null;
  cancelPending();
  return open;
};

export { cancelPreview };
