/* @layer renderer-app @kind logic */
import { CHIP_OPTIONS } from './asset-list.constants';
import type { AssetRow, ChipCount } from './asset-list.type';
import { chipRows } from './chip-rows';
import { searchRows } from './search-rows';

const chipCounts = (rows: readonly AssetRow[], search: string): readonly ChipCount[] => {
  const found = searchRows(rows, search);
  return CHIP_OPTIONS.map((option) => ({ chip: option.value, count: chipRows(found, option.value).length }));
};

export { chipCounts };
