/* @layer renderer-app @kind hook */
import { useEscapeStack } from '@drizztdourden08/tessera';
import { cancelPreview } from '../../../editor/pending/cancel-preview';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useSelectionStore } from '../../../stores/useSelectionStore';

const useEscapeCancel = (): void => {
  const pending = usePendingStore((state) => state.pending !== null);
  const drawing = useSelectionStore((state) => state.vertices.length > 0);
  useEscapeStack({ level: 'popover', onEscape: cancelPreview, active: pending || drawing });
};

export { useEscapeCancel };
