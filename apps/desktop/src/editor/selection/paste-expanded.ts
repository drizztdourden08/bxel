/* @layer renderer-app @kind logic */
import { pasteInPlace } from './paste-in-place';
import { prepareFor } from './prepare-paste';

const pasteExpanded = (): boolean => {
  prepareFor('expand');
  return pasteInPlace();
};

export { pasteExpanded };
