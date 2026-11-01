/* @layer renderer-app @kind logic */
import { useMoveJournalStore } from '../stores/useMoveJournalStore';
import type { Relocation } from './file-ops.type';
import { undoMove } from './undo-move';

const recordMove = (label: string, moves: readonly Relocation[]): (() => void) => {
  const id = useMoveJournalStore.getState().record(label, moves);
  return () => void undoMove(id);
};

export { recordMove };
