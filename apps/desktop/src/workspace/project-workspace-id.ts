/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const projectWorkspaceId = (): DocumentId | null =>
  Object.values(useWorkspaceStore.getState().workspaces).find((workspace) => workspace.kind === 'project')?.documentId ?? null;

export { projectWorkspaceId };
