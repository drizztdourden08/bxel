/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { Failure } from '@bxel/mcp';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import type { ToolContext } from '../assistant.type';
import { checkPathAccess } from './check-path-access';

const filesOf = (context: ToolContext, documentId: DocumentId): readonly string[] => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const own = context.paths.pathOf(documentId);
  return [...(workspace ? [...workspace.paths.values()] : []), ...(own === undefined ? [] : [own])];
};

const checkSaveAccess = (context: ToolContext, documentId: DocumentId): Failure | null => {
  for (const path of filesOf(context, documentId)) {
    const denied = checkPathAccess(context, path);
    if (denied) return denied;
  }
  return null;
};

export { checkSaveAccess };
