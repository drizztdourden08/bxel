/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { toSlashes } from '../workspace/to-slashes';

const rowsByPath = (rows: readonly AssetRow[]): ReadonlyMap<string, AssetRow> =>
  new Map(rows.filter((row) => row.path !== '').map((row) => [toSlashes(row.path).toLowerCase(), row] as const));

export { rowsByPath };
