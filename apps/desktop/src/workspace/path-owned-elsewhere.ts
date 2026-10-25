/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { isSamePath } from '@bxel/project';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const pathOwnedElsewhere = (documentId: DocumentId, key: AssetKey, path: string): boolean =>
  Object.values(useWorkspaceStore.getState().workspaces).some((workspace) =>
    [...workspace.paths].some(([id, known]) => (workspace.documentId !== documentId || id !== key.id) && isSamePath(known, path)),
  );

export { pathOwnedElsewhere };
