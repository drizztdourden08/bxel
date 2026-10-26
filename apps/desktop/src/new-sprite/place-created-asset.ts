/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { adoptPath } from '../workspace/adopt-path';
import { pathInDir } from '../workspace/path-in-dir';

const placeCreatedAsset = (host: DocumentHost, documentId: DocumentId, key: AssetKey, dir: string): void => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const artwork = host.view(documentId)?.state.artwork;
  if (!workspace || !artwork) return;
  const path = pathInDir(workspace, artwork, key, dir);
  if (path !== null) adoptPath(host, documentId, key, path);
};

export { placeCreatedAsset };
