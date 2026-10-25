/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { assetHash } from './asset-hash';
import { keyId } from './key-id';
import type { SavedAssets, Workspace } from './workspace.type';

const settledPaths = (workspace: Workspace, result: SavedAssets): Map<string, string> => {
  const paths = new Map(workspace.paths);
  const written = new Set(result.written.map((each) => each.key.id));
  for (const [id, path] of result.paths) if (paths.has(id) || written.has(id)) paths.set(id, path);
  return paths;
};

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
  return { ...workspace, paths: settledPaths(workspace, result), saved, dirty };
};

export { settleSaved };
