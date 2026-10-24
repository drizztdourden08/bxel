/* @layer renderer-app @kind logic */
import type { FlushReport } from '@bxel/mcp';
import { recoveryService } from '../recovery/recovery-service';
import { dirtyDocuments } from '../recovery/dirty-documents';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useFileStore } from '../stores/useFileStore';

const answerFlush = async (mode: 'recover' | 'discard' | 'check'): Promise<FlushReport> => {
  const { views, order } = useDocumentStore.getState();
  const unsaved = dirtyDocuments(views, order, (documentId) => useFileStore.getState().paths[documentId]);
  if (mode === 'recover') await recoveryService.flush();
  return { unsaved };
};

export { answerFlush };
