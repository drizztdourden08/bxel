/* @layer renderer-app @kind logic */
import { baseStatus } from './base-status';
import { missingTargets } from './missing-targets';
import { EMPTY_STATUS } from './project-browser.constants';
import type { ItemStatus, ItemTree, StatusInput, StatusMap } from './project-browser.type';

const rollUp = (tree: ItemTree, statuses: Map<string, ItemStatus>): void => {
  const totals = new Map<string, { unsaved: number; missing: number }>();
  for (const item of tree.items.values()) {
    const status = statuses.get(item.key);
    if (item.row === null || status === undefined || (!status.unsaved && status.missing.length === 0)) continue;
    for (let parent = item.parentKey; parent !== null; parent = tree.items.get(parent)?.parentKey ?? null) {
      const total = totals.get(parent) ?? { unsaved: 0, missing: 0 };
      totals.set(parent, { unsaved: total.unsaved + Number(status.unsaved), missing: total.missing + Number(status.missing.length > 0) });
    }
  }
  for (const [key, total] of totals) {
    statuses.set(key, { ...(statuses.get(key) ?? EMPTY_STATUS), unsavedBelow: total.unsaved, missingBelow: total.missing });
  }
};

const buildStatuses = (input: StatusInput): StatusMap => {
  const { tree, referrers, openKeys, activeKey } = input;
  const context = { referrers, openKeys, activeKey, missing: missingTargets(tree, referrers) };
  const statuses = new Map<string, ItemStatus>();
  for (const item of tree.items.values()) statuses.set(item.key, baseStatus(item, context));
  rollUp(tree, statuses);
  return statuses;
};

export { buildStatuses };
