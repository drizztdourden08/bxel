/* @layer renderer-app @kind logic */
import type { RowKind } from '../asset-list/asset-list.type';
import { listKindOf } from './list-kind-of';
import { stateHolds } from './state-holds';
import { FILTER_STATES } from './project-browser.constants';
import type { FilterCounts, ItemState, ItemTree, StatusMap } from './project-browser.type';

const filterCounts = (tree: ItemTree, statuses: StatusMap): FilterCounts => {
  const kinds: Partial<Record<RowKind, number>> = {};
  const states: Record<ItemState, number> = { unsaved: 0, open: 0, missing: 0, unused: 0 };
  for (const item of tree.items.values()) {
    if (item.role !== 'file' && item.role !== 'ghost') continue;
    const kind = listKindOf(item);
    kinds[kind] = (kinds[kind] ?? 0) + 1;
    const status = statuses.get(item.key);
    if (status === undefined) continue;
    for (const state of FILTER_STATES) if (stateHolds(status, [state])) states[state] += 1;
  }
  return { kinds, states };
};

export { filterCounts };
