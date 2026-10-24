/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { GRANT_LEVELS } from '../workspace/workspace.constants';
import { readTiledFiles } from './read-tiled-files';
import { TILED_FILTERS, TILED_TEXT } from './tiled-import.constants';
import type { TiledRead } from './tiled-import.type';

const pickTiledFile = async (documents: DocumentsPort): Promise<TiledRead | null> => {
  const picked = await documents.open({
    title: TILED_TEXT.pickTitle,
    filters: TILED_FILTERS,
    grantFolder: { ask: true, levels: GRANT_LEVELS },
  });
  return picked === null ? null : readTiledFiles(documents, picked.path);
};

export { pickTiledFile };
