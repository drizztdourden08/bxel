/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';
import { selectedSlice } from './selected-slice';

const sliceSelectedByTool = (): boolean => useToolStore.getState().tool === 'slice' && selectedSlice() !== null;

export { sliceSelectedByTool };
