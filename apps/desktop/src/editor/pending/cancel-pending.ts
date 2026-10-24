/* @layer renderer-app @kind logic */
import { usePendingStore } from '../../stores/usePendingStore';

const cancelPending = (): void => {
  usePendingStore.getState().clear();
};

export { cancelPending };
