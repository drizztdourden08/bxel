/* @layer renderer-app @kind logic */
import { fileSafeStem } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import { baseName } from '../files/base-name';
import { assetHash } from './asset-hash';
import { assetName } from './asset-name';
import { keyId } from './key-id';
import { referrersOf } from './referrers-of';
import { savedHash } from './saved-hash';
import { NAME_FALLBACK } from './workspace.constants';
import type { Workspace } from './workspace.type';

const renamed = (workspace: Workspace, artwork: Artwork, key: AssetKey): boolean => {
  const path = workspace.paths.get(key.id);
  const name = assetName(artwork, key);
  return path !== undefined && name !== null && baseName(path) !== fileSafeStem(name, NAME_FALLBACK);
};

const stale = (workspace: Workspace, artwork: Artwork, key: AssetKey): boolean =>
  savedHash(workspace, key, new Map(workspace.saved)) !== assetHash(artwork, key, workspace.paths);

const refreshed = (workspace: Workspace, artwork: Artwork, key: AssetKey): readonly AssetKey[] => {
  if (key.kind === 'project') return [];
  if (renamed(workspace, artwork, key)) return referrersOf(artwork, key);
  return key.kind === 'palette' ? referrersOf(artwork, key).filter((each) => stale(workspace, artwork, each)) : [];
};

const saveAllKeys = (workspace: Workspace, artwork: Artwork, live: readonly AssetKey[]): readonly AssetKey[] => {
  const chosen = new Set(live.map(keyId));
  const extra = new Map<string, AssetKey>();
  for (const key of live.flatMap((each) => refreshed(workspace, artwork, each))) {
    const id = keyId(key);
    if (!chosen.has(id) && workspace.paths.has(key.id) && assetName(artwork, key) !== null) extra.set(id, key);
  }
  return [...live, ...extra.values()];
};

export { saveAllKeys };
