/* @layer renderer-app @kind logic */
import { clearPixels } from './clear-pixels';
import { SELECTION_LABELS } from './selection.constants';

const deleteSelection = (): boolean => clearPixels(SELECTION_LABELS.delete);

export { deleteSelection };
