/* @layer renderer-app @kind logic */
import { ASSET_FORMAT, fileSafeStem } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import { assetName } from './asset-name';
import { uniquePath } from './unique-path';
import { NAME_FALLBACK } from './workspace.constants';
import type { Workspace } from './workspace.type';

const newAssetPath = (workspace: Workspace, artwork: Artwork, key: AssetKey): string | null => {
  const dir = workspace.dirs[key.kind];
  const name = assetName(artwork, key);
  if (dir === undefined || name === null || key.kind === 'project') return null;
  if (key.kind === 'palette' && workspace.kind !== 'project') return null;
  const taken = new Set([...workspace.paths.values()].map((path) => path.toLowerCase()));
  return uniquePath(dir, fileSafeStem(name, NAME_FALLBACK), ASSET_FORMAT[key.kind].extension, taken);
};

export { newAssetPath };
