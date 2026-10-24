/* @layer renderer-app @kind logic */
import type { AssetRow } from './asset-list.type';

const usingRows = (rows: readonly AssetRow[], spriteId: string | null): readonly AssetRow[] => {
  if (spriteId === null) return rows;
  const sprite = rows.find((row) => row.kind === 'sprite' && row.assetId === spriteId);
  const users = new Set(sprite?.usedBy ?? []);
  return rows.filter((row) => row.kind === 'sheet' && row.assetId !== null && users.has(row.assetId));
};

export { usingRows };
