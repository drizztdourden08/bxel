/* @layer renderer-app @kind logic */
import type { AssetRow } from '../../asset-list/asset-list.type';

const usingAssets = (rows: readonly AssetRow[], everything: readonly AssetRow[], assetId: string | null): readonly AssetRow[] => {
  if (assetId === null) return rows;
  const users = new Set(everything.find((row) => row.assetId === assetId)?.usedBy ?? []);
  return rows.filter((row) => row.assetId !== null && users.has(row.assetId));
};

export { usingAssets };
