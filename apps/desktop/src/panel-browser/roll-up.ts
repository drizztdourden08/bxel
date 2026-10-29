/* @layer renderer-app @kind logic */
import { EMPTY_STATUS } from './project-browser.constants';
import type { ItemStatus, ItemTree } from './project-browser.type';
import type { Total } from './roll-up.type';

const carries = (status: ItemStatus | undefined): status is ItemStatus => status !== undefined && (status.unsaved || status.missing.length > 0);

const add = (total: Total | undefined, status: ItemStatus): Total => ({
  unsaved: (total?.unsaved ?? 0) + Number(status.unsaved),
  missing: (total?.missing ?? 0) + Number(status.missing.length > 0),
});

const rollUp = (tree: ItemTree, statuses: Map<string, ItemStatus>): void => {
  const totals = new Map<string, Total>();
  for (const item of tree.items.values()) {
    const status = statuses.get(item.key);
    if (item.row === null || !carries(status)) continue;
    for (let parent = item.parentKey; parent !== null; parent = tree.items.get(parent)?.parentKey ?? null) totals.set(parent, add(totals.get(parent), status));
  }
  for (const [key, total] of totals) statuses.set(key, { ...(statuses.get(key) ?? EMPTY_STATUS), unsavedBelow: total.unsaved, missingBelow: total.missing });
};

export { rollUp };
