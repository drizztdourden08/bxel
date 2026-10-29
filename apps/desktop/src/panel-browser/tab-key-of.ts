/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { keyId } from '../workspace/key-id';

const tabKeyOf = (row: AssetRow): string | null => {
  if (row.assetId === null || row.kind === 'image' || row.kind === 'other') return null;
  return keyId({ kind: row.kind, id: row.assetId });
};

export { tabKeyOf };
