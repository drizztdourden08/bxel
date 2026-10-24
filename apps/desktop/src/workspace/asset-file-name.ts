/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import { fileName } from '../files/file-name';
import { assetName } from './asset-name';
import { NAME_FALLBACK } from './workspace.constants';
import type { Workspace } from './workspace.type';

const assetFileName = (workspace: Workspace, artwork: Artwork, key: AssetKey): string => {
  if (key.kind === 'project') return workspace.projectFile === null ? workspace.name : fileName(workspace.projectFile);
  const path = workspace.paths.get(key.id);
  if (path !== undefined) return fileName(path);
  const name = assetName(artwork, key) ?? assetName(workspace.base, key) ?? NAME_FALLBACK;
  return `${name}${ASSET_FORMAT[key.kind].extension}`;
};

export { assetFileName };
