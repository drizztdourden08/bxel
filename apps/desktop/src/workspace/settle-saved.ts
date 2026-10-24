/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { assetHash } from './asset-hash';
import { keyId } from './key-id';
import type { SavedAssets, Workspace } from './workspace.type';

const settleSaved = (workspace: Workspace, current: Artwork, result: SavedAssets): Workspace => {
  const saved = new Map(workspace.saved);
  const dirty = new Set(workspace.dirty);
  const written = new Set(result.written.map((each) => keyId(each.key)));
  for (const { key, hash } of result.written) {
    saved.set(keyId(key), hash);
    const unchanged = current === result.artwork || assetHash(current, key, result.paths) === hash;
    if (unchanged) dirty.delete(keyId(key));
  }
  for (const key of result.referrers) if (!written.has(keyId(key))) dirty.add(keyId(key));
  return { ...workspace, paths: result.paths, saved, dirty };
};

export { settleSaved };
