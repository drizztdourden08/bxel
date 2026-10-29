/* @layer renderer-app @kind hook */
import { useEntryDragStore } from '../../../stores/useEntryDragStore';

const useSheetDragging = (): boolean => useEntryDragStore((state) => state.active?.source === 'sheet');

export { useSheetDragging };
