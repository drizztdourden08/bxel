/* @layer renderer-app @kind logic */
import { ASSET_FORMAT, fileSafeStem } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { FILE_TEXT } from '../files/files.constants';
import { assetName } from './asset-name';
import { parentOf } from './parent-of';
import { toSlashes } from './to-slashes';
import { vetPickedPath } from './vet-picked-path';
import { ASSET_FILE_LABEL, BXEL_ENDING, GRANT_LEVELS, NAME_FALLBACK } from './workspace.constants';
import type { AssetPick, Workspace } from './workspace.type';

const pickAssetPath = async (documents: DocumentsPort, workspace: Workspace, artwork: Artwork, key: AssetKey): Promise<AssetPick | null> => {
  const extension = ASSET_FORMAT[key.kind].extension;
  const stem = fileSafeStem(assetName(artwork, key) ?? NAME_FALLBACK, NAME_FALLBACK);
  const known = workspace.paths.get(key.id);
  const dir = known === undefined ? workspace.dirs[key.kind] : parentOf(known);
  const picked = await documents.saveAs({
    title: FILE_TEXT.saveTitle,
    defaultPath: dir === undefined ? `${stem}${extension}` : `${dir}/${stem}${extension}`,
    filters: [{ name: ASSET_FILE_LABEL[key.kind], extensions: [extension.slice(1)] }],
    grantFolder: { ask: true, levels: GRANT_LEVELS },
  });
  if (picked === null) return null;
  const chosen = toSlashes(picked.path);
  const path = `${chosen.replace(BXEL_ENDING, '')}${extension}`;
  if (!(await vetPickedPath(documents, { documentId: workspace.documentId, key }, { chosen, path }))) return null;
  return { path, granted: picked.folderGranted };
};

export { pickAssetPath };
