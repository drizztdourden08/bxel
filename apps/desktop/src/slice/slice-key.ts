/* @layer renderer-app @kind logic */
import { useSliceToolStore } from '../stores/useSliceToolStore';
import { deleteSelectedSlice } from './delete-selected-slice';
import { selectedSlice } from './selected-slice';
import { sliceSelectedByTool } from './slice-selected-by-tool';

const sliceKey = (key: string): boolean => {
  if (!sliceSelectedByTool()) return false;
  if (key === 'Delete') return deleteSelectedSlice();
  const slice = key === 'Enter' ? selectedSlice() : null;
  if (!slice) return false;
  useSliceToolStore.getState().openDialog(slice.id);
  return true;
};

export { sliceKey };
