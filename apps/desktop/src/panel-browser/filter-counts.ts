/* @layer renderer-app @kind logic */
import type { RowKind } from '../asset-list/asset-list.type';
import { listKindOf } from './list-kind-of';
import type { FilterCounts, ItemStatus, ItemTree } from './project-browser.type';
import type { StatusMap } from './project-browser.type';

const holds = (status: ItemStatus): readonly boolean[] => [status.unsaved, status.open, status.missing.length > 0, status.unused];

const filterCounts = (tree: ItemTree, statuses: StatusMap): FilterCounts => {
  const kinds: Partial<Record<RowKind, number>> = {};
  const totals = [0, 0, 0, 0];
  for (const item of tree.items.values()) {
    if (item.role !== 'file' && item.role !== 'ghost') continue;
    const kind = listKindOf(item);
    kinds[kind] = (kinds[kind] ?? 0) + 1;
    const status = statuses.get(item.key);
    if (status !== undefined) holds(status).forEach((held, at) => (totals[at] = (totals[at] ?? 0) + Number(held)));
  }
  const [unsaved = 0, open = 0, missing = 0, unused = 0] = totals;
  return { kinds, states: { unsaved, open, missing, unused } };
};

export { filterCounts };
