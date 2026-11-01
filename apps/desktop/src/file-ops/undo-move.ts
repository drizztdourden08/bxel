/* @layer renderer-app @kind logic */
import { announce, toast } from '@drizztdourden08/brock-react';
import { useMoveJournalStore } from '../stores/useMoveJournalStore';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { OpOutcome } from './file-ops.type';
import { relocate } from './relocate';

const undoMove = async (id?: number): Promise<OpOutcome> => {
  const journal = useMoveJournalStore.getState();
  const entry = id === undefined ? journal.takeLast() : journal.take(id);
  if (entry === null) {
    toast(FILE_OPS_TEXT.nothingToUndo, { variant: 'warning' });
    return { ok: false, message: FILE_OPS_TEXT.nothingToUndo };
  }
  const outcome = await relocate(entry.moves.map((move) => ({ from: move.to, to: move.from })).reverse());
  if (!outcome.ok) {
    toast(outcome.message, { variant: 'danger' });
    return outcome;
  }
  const said = FILE_OPS_TEXT.undone(entry.label);
  toast(said, { variant: 'success' });
  announce(said);
  return outcome;
};

export { undoMove };
