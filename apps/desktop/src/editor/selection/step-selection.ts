/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { HistoryDirection } from '../editor.type';
import { useSelectionHistoryStore } from '../../stores/useSelectionHistoryStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { newestTag } from './newest-tag';

const stepSelection = (direction: HistoryDirection, documentId: DocumentId): boolean => {
  const history = useSelectionHistoryStore.getState();
  const step = (direction === 'undo' ? history.undo : history.redo).at(-1);
  if (step?.documentId !== documentId || step.tag !== newestTag(documentId)) return false;
  if (direction === 'undo') {
    history.popUndo();
    history.pushRedo(step);
  } else {
    history.popRedo();
    history.pushUndo(step);
  }
  const mask = direction === 'undo' ? step.before : step.after;
  useSelectionStore.getState().setMask(mask, mask ? documentId : null);
  return true;
};

export { stepSelection };
