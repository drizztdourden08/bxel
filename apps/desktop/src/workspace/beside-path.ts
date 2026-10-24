/* @layer renderer-app @kind logic */
import { ASSET_FORMAT, fileSafeStem } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import { assetName } from './asset-name';
import { uniquePath } from './unique-path';
import { NAME_FALLBACK } from './workspace.constants';
import type { Workspace } from './workspace.type';

const besidePath = (workspace: Workspace, artwork: Artwork, key: AssetKey): string | null => {
  const dir = workspace.dirs[key.kind];
  if (dir === undefined) return null;
  const taken = new Set([...workspace.paths.values()].map((path) => path.toLowerCase()));
  return uniquePath(dir, fileSafeStem(assetName(artwork, key) ?? NAME_FALLBACK, NAME_FALLBACK), ASSET_FORMAT[key.kind].extension, taken);
};

export { besidePath };
