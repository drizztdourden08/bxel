/* @layer renderer-app @kind logic */
import { baseName } from '../files/base-name';
import { movedPath } from '../files/moved-path';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetKeys } from './asset-keys';
import { renameAsset } from './rename-asset';
import { toSlashes } from './to-slashes';

const followFileRename = (from: string, to: string): void => {
  const { host } = useDocumentStore.getState();
  const store = useWorkspaceStore.getState();
  for (const workspace of Object.values(store.workspaces)) {
    const moved = [...workspace.paths].flatMap(([id, path]) => {
      const next = movedPath(path, toSlashes(from), toSlashes(to));
      return next === null || next === path ? [] : [[id, next, baseName(path) !== baseName(next)] as const];
    });
    if (moved.length === 0) continue;
    store.patch(workspace.documentId, (each) => ({ ...each, paths: new Map([...each.paths, ...moved.map(([id, path]) => [id, path] as const)]) }));
    const artwork = host.view(workspace.documentId)?.state.artwork;
    const keys = artwork ? assetKeys(artwork) : [];
    for (const [id, path, renamed] of moved) {
      const key = keys.find((each) => each.id === id);
      if (key && renamed) renameAsset(host, workspace.documentId, key, baseName(path));
    }
  }
};

export { followFileRename };
