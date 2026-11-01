/* @layer renderer-app @kind test */
import { resetEditor } from '../editor/option-harness';
import { selectionStore } from './selection-reset';

const resetToolTests = (): void => {
  resetEditor();
  selectionStore();
};

export { resetToolTests };
