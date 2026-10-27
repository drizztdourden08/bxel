/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import type { Failure } from '@bxel/mcp';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { companionsOf } from '../../workspace/companions-of';
import type { ToolContext } from '../assistant.type';
import { checkPathAccess } from './check-path-access';

const checkMoveAccess = (context: ToolContext, documentId: DocumentId, key: AssetKey, moving: boolean): Failure | null => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const artwork = context.host.view(documentId)?.state.artwork;
  if (!workspace || !artwork) return null;
  const extra = companionsOf(workspace, artwork, key).filter((each) => each.id !== key.id);
  const own = moving ? workspace.paths.get(key.id) : undefined;
  const paths = [...(own === undefined ? [] : [own]), ...extra.flatMap((each) => workspace.paths.get(each.id) ?? [])];
  for (const path of paths) {
    const denied = checkPathAccess(context, path);
    if (denied) return denied;
  }
  return null;
};

export { checkMoveAccess };
