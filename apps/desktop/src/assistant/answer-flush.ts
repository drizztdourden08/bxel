/* @layer renderer-app @kind logic */
import type { FlushReport } from '@bxel/mcp';
import { recoveryService } from '../recovery/recovery-service';
import { dirtyDocuments } from '../recovery/dirty-documents';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const answerFlush = async (mode: 'recover' | 'discard' | 'check'): Promise<FlushReport> => {
  const { views, order } = useDocumentStore.getState();
  const unsaved = dirtyDocuments(views, order, useWorkspaceStore.getState().workspaces);
  if (mode === 'recover') await recoveryService.flush();
  return { unsaved };
};

export { answerFlush };
