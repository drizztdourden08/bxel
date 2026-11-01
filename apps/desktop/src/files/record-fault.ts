/* @layer renderer-app @kind logic */
import { useFaultStore } from '../stores/useFaultStore';
import type { FileAction, FileOutcome } from './files.type';

const recordFault = (outcome: FileOutcome, action: FileAction): void => {
  if (action.kind !== 'open' && action.kind !== 'openPath') return;
  if (outcome.kind === 'failed') useFaultStore.getState().set({ message: outcome.message, action });
  else if (outcome.kind === 'done') useFaultStore.getState().set(null);
};

export { recordFault };
