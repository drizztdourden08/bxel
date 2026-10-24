/* @layer renderer-app @kind logic */
import { KIND_ORDER } from './asset-list.constants';
import type { AssetRow, AssetSort } from './asset-list.type';
import type { Compare } from './sort-rows.type';

const byName: Compare = (left, right) => left.name.localeCompare(right.name) || left.path.localeCompare(right.path);

const byKind: Compare = (left, right) => KIND_ORDER.indexOf(left.kind) - KIND_ORDER.indexOf(right.kind) || byName(left, right);

const byModified: Compare = (left, right) => right.modified - left.modified || byName(left, right);

const byFolder: Compare = (left, right) => left.folder.localeCompare(right.folder) || byName(left, right);

const sortRows = (rows: readonly AssetRow[], sort: AssetSort): readonly AssetRow[] => {
  const compare: Record<AssetSort, Compare> = { name: byName, kind: byKind, modified: byModified, folder: byFolder };
  return [...rows].sort(compare[sort]);
};

export { sortRows };
