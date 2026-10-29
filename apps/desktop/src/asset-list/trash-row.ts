/* @layer renderer-app @kind logic */
import { trashEntry } from '../project/trash-entry';
import { fileName } from '../files/file-name';
import { parentOf } from '../workspace/parent-of';
import type { AssetRow } from './asset-list.type';
import { removeLoadedRows } from './remove-loaded-rows';

const trashRow = (row: AssetRow): void => {
  if (row.loaded) removeLoadedRows([row]);
  else void trashEntry({ dir: parentOf(row.path), name: fileName(row.path), kind: 'file' });
};

export { trashRow };
