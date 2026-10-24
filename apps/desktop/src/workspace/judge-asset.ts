/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { assetHash } from './asset-hash';
import { assetName } from './asset-name';
import { newAssetPath } from './new-asset-path';
import { savedHash } from './saved-hash';
import type { Tally, Workspace } from './workspace.type';

const judgeAsset = (workspace: Workspace, artwork: Artwork, key: AssetKey, tally: Tally): boolean => {
  if (key.kind === 'project') return true;
  const baseline = savedHash(workspace, key, tally.saved);
  const exists = assetName(artwork, key) !== null;
  if (!exists) {
    if (baseline === undefined) tally.paths.delete(key.id);
    return baseline !== undefined;
  }
  if (!tally.paths.has(key.id)) {
    const planned = newAssetPath({ ...workspace, paths: tally.paths }, artwork, key);
    if (planned !== null) tally.paths.set(key.id, planned);
  }
  return baseline === undefined || assetHash(artwork, key, tally.paths) !== baseline;
};

export { judgeAsset };
