/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { HistoryDirection } from '../editor.type';
import { useSelectionHistoryStore } from '../../stores/useSelectionHistoryStore';
import { newestTag } from './newest-tag';

const canStepSelection = (direction: HistoryDirection, documentId: DocumentId): boolean => {
  const history = useSelectionHistoryStore.getState();
  const step = (direction === 'undo' ? history.undo : history.redo).at(-1);
  return step?.documentId === documentId && step.tag === newestTag(documentId);
};

export { canStepSelection };
