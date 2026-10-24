/* @layer renderer-app @kind logic */
import type { AssetQuery, AssetRow } from './asset-list.type';
import { chipRows } from './chip-rows';
import { searchRows } from './search-rows';
import { sortRows } from './sort-rows';
import { usingRows } from './using-rows';

const queryRows = (rows: readonly AssetRow[], query: AssetQuery): readonly AssetRow[] =>
  sortRows(usingRows(chipRows(searchRows(rows, query.search), query.chip), query.usedBySprite), query.sort);

export { queryRows };
