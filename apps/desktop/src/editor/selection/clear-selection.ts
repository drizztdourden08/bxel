/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';

const clearSelection = (): void => {
  useSelectionStore.getState().setMask(null, null);
};

export { clearSelection };
