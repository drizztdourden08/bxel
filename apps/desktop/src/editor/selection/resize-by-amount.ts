/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { resizeSelection } from './resize-selection';

const resizeByAmount = (direction: 1 | -1): void => resizeSelection(direction * useSelectionStore.getState().amount);

export { resizeByAmount };
