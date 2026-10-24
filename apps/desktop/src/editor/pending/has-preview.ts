/* @layer renderer-app @kind logic */
import { usePendingStore } from '../../stores/usePendingStore';
import { useSelectionStore } from '../../stores/useSelectionStore';

const hasPreview = (): boolean => usePendingStore.getState().pending !== null || useSelectionStore.getState().vertices.length > 0;

export { hasPreview };
