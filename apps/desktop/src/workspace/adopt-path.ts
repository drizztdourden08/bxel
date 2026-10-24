/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey, DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { baseName } from '../files/base-name';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetKeys } from './asset-keys';
import { newAssetPath } from './new-asset-path';
import { parentOf } from './parent-of';
import { renameAsset } from './rename-asset';
import { sameDirs } from './same-dirs';
import type { Workspace } from './workspace.type';

const planRest = (workspace: Workspace, artwork: Artwork): Workspace => {
  const paths = new Map(workspace.paths);
  for (const each of assetKeys(artwork)) {
    if (paths.has(each.id)) continue;
    const planned = newAssetPath({ ...workspace, paths }, artwork, each);
    if (planned !== null) paths.set(each.id, planned);
  }
  return { ...workspace, paths };
};

const adoptPath = (host: DocumentHost, documentId: DocumentId, key: AssetKey, path: string): void => {
  const artwork = host.view(documentId)?.state.artwork;
  useWorkspaceStore.getState().patch(documentId, (workspace) => {
    const paths = new Map(workspace.paths);
    paths.set(key.id, path);
    const root = workspace.root ?? parentOf(path);
    const next = { ...workspace, paths, root, dirs: workspace.root === null ? sameDirs(root) : workspace.dirs };
    return workspace.root === null && artwork ? planRest(next, artwork) : next;
  });
  renameAsset(host, documentId, key, baseName(path));
};

export { adoptPath };
