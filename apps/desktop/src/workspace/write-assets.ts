/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetHash } from './asset-hash';
import { assetPreview } from './asset-preview';
import { encodeAsset } from './encode-asset';
import { freePaths } from './free-paths';
import { settleSaved } from './settle-saved';
import { syncNames } from './sync-names';
import { SAVE_ORDER } from './workspace.constants';
import type { WrittenAsset } from './workspace.type';

const ordered = (keys: readonly AssetKey[]): readonly AssetKey[] =>
  [...keys].sort((left, right) => SAVE_ORDER.indexOf(left.kind) - SAVE_ORDER.indexOf(right.kind));

const writeAssets = async (
  kit: FileKit,
  documentId: DocumentId,
  keys: readonly AssetKey[],
  chosen: string | null = null,
): Promise<readonly WrittenAsset[]> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const view = kit.host.view(documentId);
  if (!workspace || !view) return [];
  const artwork = view.state.artwork;
  const synced = await syncNames(kit.documents, workspace, artwork, keys);
  const paths = await freePaths(kit.documents, workspace, synced.paths, { keys, chosen });
  const written: WrittenAsset[] = [];
  try {
    for (const key of ordered(keys)) {
      const path = paths.get(key.id);
      if (path === undefined || key.kind === 'project') continue;
      const bytes = encodeAsset(artwork, key, paths, { preview: assetPreview(artwork, key), clock: kit.clock });
      await kit.documents.write(path, bytes, { recent: workspace.kind !== 'project' });
      written.push({ key, path, hash: assetHash(artwork, key, paths) ?? '' });
    }
  } finally {
    const current = kit.host.view(documentId)?.state.artwork ?? artwork;
    useWorkspaceStore.getState().patch(documentId, (each) => settleSaved(each, current, { artwork, paths, written, referrers: synced.referrers }));
  }
  return written;
};

export { writeAssets };
