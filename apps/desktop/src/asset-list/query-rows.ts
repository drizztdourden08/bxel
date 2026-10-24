/* @layer renderer-app @kind logic */
import type { AssetQuery, AssetRow } from './asset-list.type';
import { chipRows } from './chip-rows';
import { searchRows } from './search-rows';
import { sortRows } from './sort-rows';
import { usingRows } from './using-rows';

const queryRows = (rows: readonly AssetRow[], query: AssetQuery): readonly AssetRow[] => {
  if (query.usedBySprite !== null) return sortRows(usingRows(rows, query.usedBySprite), query.sort);
  return sortRows(chipRows(searchRows(rows, query.search), query.chip), query.sort);
};

export { queryRows };
