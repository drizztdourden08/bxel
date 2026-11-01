/* @layer renderer-app @kind logic */
import { useReferenceStore } from '../stores/useReferenceStore';
import { requestedReferences } from './requested-references';

const forgetReference = (path: string): void => {
  requestedReferences.delete(path);
  useReferenceStore.getState().forget(path);
};

export { forgetReference };
