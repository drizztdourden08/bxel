/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import { assetHash } from './asset-hash';
import { keyId } from './key-id';
import { onDisk } from './on-disk';
import type { Workspace } from './workspace.type';

const savedHash = (workspace: Workspace, key: AssetKey, saved: Map<string, string>): string | undefined => {
  const id = keyId(key);
  const known = saved.get(id);
  if (known !== undefined) return known;
  if (!onDisk(workspace, key)) return undefined;
  const hash = assetHash(workspace.base, key, workspace.paths) ?? '';
  saved.set(id, hash);
  return hash;
};

export { savedHash };
