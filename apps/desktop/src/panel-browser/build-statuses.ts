/* @layer renderer-app @kind logic */
import { baseStatus } from './base-status';
import { missingTargets } from './missing-targets';
import type { ItemStatus, StatusInput, StatusMap } from './project-browser.type';
import { rollUp } from './roll-up';

const buildStatuses = (input: StatusInput): StatusMap => {
  const { tree, referrers, openKeys, activeKey } = input;
  const context = { referrers, openKeys, activeKey, missing: missingTargets(tree, referrers) };
  const statuses = new Map<string, ItemStatus>();
  for (const item of tree.items.values()) statuses.set(item.key, baseStatus(item, context));
  rollUp(tree, statuses);
  return statuses;
};

export { buildStatuses };
