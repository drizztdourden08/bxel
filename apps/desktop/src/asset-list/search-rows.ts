/* @layer renderer-app @kind logic */
import { KIND_LABEL } from './asset-list.constants';
import type { AssetRow } from './asset-list.type';

const matches = (row: AssetRow, needle: string): boolean =>
  [row.name, row.folder, KIND_LABEL[row.kind]].some((text) => text.toLowerCase().includes(needle));

const searchRows = (rows: readonly AssetRow[], search: string): readonly AssetRow[] => {
  const needle = search.trim().toLowerCase();
  return needle === '' ? rows : rows.filter((row) => matches(row, needle));
};

export { searchRows };
