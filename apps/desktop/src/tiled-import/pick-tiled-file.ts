/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { GRANT_LEVELS } from '../workspace/workspace.constants';
import { readTiledFiles } from './read-tiled-files';
import { readTiledTilesetFile } from './read-tiled-tileset-file';
import { TILED_FILTERS, TILED_TEXT, TILESET_FILE } from './tiled-import.constants';
import type { TiledPick } from './tiled-import.type';

const pickTiledFile = async (documents: DocumentsPort): Promise<TiledPick | null> => {
  const picked = await documents.open({
    title: TILED_TEXT.pickTitle,
    filters: TILED_FILTERS,
    grantFolder: { ask: true, levels: GRANT_LEVELS },
  });
  if (picked === null) return null;
  return TILESET_FILE.test(picked.path) ? readTiledTilesetFile(documents, picked.path) : readTiledFiles(documents, picked.path);
};

export { pickTiledFile };
