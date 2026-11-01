/* @layer renderer-app @kind logic */
import { useFaultStore } from '../stores/useFaultStore';
import type { FileAction, FileOutcome } from './files.type';
import { hasActiveDocument } from './has-active-document';

const recordFault = (outcome: FileOutcome, action: FileAction): void => {
  if (action.kind !== 'open' && action.kind !== 'openPath') return;
  const { set } = useFaultStore.getState();
  if (outcome.kind === 'failed') set(hasActiveDocument() ? null : { message: outcome.message, action });
  else if (outcome.kind === 'done') set(null);
};

export { recordFault };
