/* @layer renderer-app @kind logic */
import { CHIP_OF_KIND } from './asset-list.constants';
import type { AssetChip, AssetRow } from './asset-list.type';

const chipRows = (rows: readonly AssetRow[], chip: AssetChip): readonly AssetRow[] =>
  chip === 'all' ? rows : rows.filter((row) => CHIP_OF_KIND[row.kind] === chip);

export { chipRows };
