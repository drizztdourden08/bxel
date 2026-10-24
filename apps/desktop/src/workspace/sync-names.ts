/* @layer renderer-app @kind logic */
import { ASSET_FORMAT, fileSafeStem } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { baseName } from '../files/base-name';
import { assetName } from './asset-name';
import { onDisk } from './on-disk';
import { parentOf } from './parent-of';
import { referrersOf } from './referrers-of';
import { uniquePath } from './unique-path';
import { NAME_FALLBACK } from './workspace.constants';
import type { NameSync, Workspace } from './workspace.type';

const targetOf = (paths: ReadonlyMap<string, string>, key: AssetKey, name: string): string | null => {
  const path = paths.get(key.id);
  const stem = fileSafeStem(name, NAME_FALLBACK);
  if (path === undefined || key.kind === 'project' || baseName(path) === stem) return null;
  const taken = new Set([...paths].filter(([id]) => id !== key.id).map(([, each]) => each.toLowerCase()));
  const target = uniquePath(parentOf(path), stem, ASSET_FORMAT[key.kind].extension, taken);
  return target.toLowerCase() === path.toLowerCase() ? null : target;
};

const syncNames = async (documents: DocumentsPort, workspace: Workspace, artwork: Artwork, keys: readonly AssetKey[]): Promise<NameSync> => {
  const paths = new Map(workspace.paths);
  const referrers: AssetKey[] = [];
  for (const key of keys) {
    const name = assetName(artwork, key);
    const target = name === null ? null : targetOf(paths, key, name);
    const path = paths.get(key.id);
    if (target === null || path === undefined) continue;
    if (onDisk(workspace, key)) {
      const moved = await documents.rename(path, target).then(() => true, () => false);
      if (!moved) continue;
    }
    paths.set(key.id, target);
    referrers.push(...referrersOf(artwork, key));
  }
  return { paths, referrers };
};

export { syncNames };
