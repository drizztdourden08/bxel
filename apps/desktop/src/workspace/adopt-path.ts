/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { baseName } from '../files/base-name';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { parentOf } from './parent-of';
import { renameAsset } from './rename-asset';
import { sameDirs } from './same-dirs';

const adoptPath = (host: DocumentHost, documentId: DocumentId, key: AssetKey, path: string): void => {
  useWorkspaceStore.getState().patch(documentId, (workspace) => {
    const paths = new Map(workspace.paths);
    paths.set(key.id, path);
    const root = workspace.root ?? parentOf(path);
    return { ...workspace, paths, root, dirs: workspace.root === null ? sameDirs(root) : workspace.dirs };
  });
  renameAsset(host, documentId, key, baseName(path));
};

export { adoptPath };
