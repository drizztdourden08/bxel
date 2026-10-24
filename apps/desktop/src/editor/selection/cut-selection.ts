/* @layer renderer-app @kind logic */
import { clearPixels } from './clear-pixels';
import { copySelection } from './copy-selection';
import { SELECTION_LABELS } from './selection.constants';

const cutSelection = (): boolean => copySelection() && clearPixels(SELECTION_LABELS.cut);

export { cutSelection };
