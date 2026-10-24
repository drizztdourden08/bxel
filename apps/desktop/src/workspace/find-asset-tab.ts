/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetKeys } from './asset-keys';
import { tabOf } from './tab-of';
import { toSlashes } from './to-slashes';
import type { OpenTab } from './workspace.type';

const findAssetTab = (path: string): OpenTab | null => {
  const wanted = toSlashes(path);
  const { host } = useDocumentStore.getState();
  for (const workspace of Object.values(useWorkspaceStore.getState().workspaces)) {
    const artwork = host.view(workspace.documentId)?.state.artwork;
    const id = [...workspace.paths].find(([, known]) => isSamePath(known, wanted))?.[0];
    const key = artwork && id !== undefined ? assetKeys(artwork).find((each) => each.id === id) : undefined;
    if (key) return tabOf(workspace.documentId, key);
  }
  return null;
};

export { findAssetTab };
