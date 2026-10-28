/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import type { AssetRow } from '../asset-list/asset-list.type';
import { referrersOf } from '../workspace/referrers-of';
import { USED_BY_KINDS } from './project-browser.constants';

const referrerMap = (artwork: Artwork, rows: readonly AssetRow[]): ReadonlyMap<string, readonly string[]> => {
  const entries = rows.flatMap((row) => {
    if (row.assetId === null || !row.loaded || !USED_BY_KINDS.includes(row.kind)) return [];
    const key = { kind: row.kind, id: row.assetId } as AssetKey;
    return [[row.assetId, referrersOf(artwork, key).map((each) => each.id)] as const];
  });
  return new Map(entries);
};

export { referrerMap };
