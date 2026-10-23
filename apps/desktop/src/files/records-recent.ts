/* @layer renderer-app @kind logic */
import { RECENT_ACTIONS } from './files.constants';
import type { FileAction, FileOutcome } from './files.type';

const recordsRecent = (action: FileAction, outcome: FileOutcome): boolean =>
  outcome.kind === 'done' && RECENT_ACTIONS.includes(action.kind);

export { recordsRecent };
