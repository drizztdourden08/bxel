/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { onDisk } from '../workspace/on-disk';

const isSaved = (documentId: DocumentId | null, spriteId: string): boolean => {
  const workspace = documentId === null ? undefined : useWorkspaceStore.getState().workspaces[documentId];
  return workspace !== undefined && onDisk(workspace, { kind: 'sprite', id: spriteId });
};

export { isSaved };
