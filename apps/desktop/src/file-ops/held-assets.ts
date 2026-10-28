/* @layer renderer-app @kind logic */
import { relativeInside } from '@bxel/project';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetKeys } from '../workspace/asset-keys';
import { toSlashes } from '../workspace/to-slashes';
import type { HeldAsset } from './file-ops.type';

/** Every loaded asset whose file is the path given or sits under it, so a folder counts all that is inside. */
const heldAssetsUnder = (path: string): readonly HeldAsset[] => {
  const wanted = toSlashes(path);
  const { views } = useDocumentStore.getState();
  return Object.values(useWorkspaceStore.getState().workspaces).flatMap((workspace) => {
    const artwork = views[workspace.documentId]?.state.artwork;
    const keys = artwork ? assetKeys(artwork) : [];
    return [...workspace.paths].flatMap(([id, held]) => {
      const key = keys.find((each) => each.id === id);
      return key && relativeInside(wanted, toSlashes(held)) !== undefined ? [{ documentId: workspace.documentId, key, path: toSlashes(held) }] : [];
    });
  });
};

export { heldAssetsUnder };
