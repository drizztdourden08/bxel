/* @layer renderer-app @kind logic */
import { activeSheetOf } from './active-sheet-of';
import type { AssetRow } from './asset-list.type';

const canCopyForSheet = (row: AssetRow): boolean => {
  const active = activeSheetOf();
  return row.kind === 'sprite' && row.loaded && (active?.sheet.entries.some((entry) => entry.spriteId === row.assetId) ?? false);
};

export { canCopyForSheet };
