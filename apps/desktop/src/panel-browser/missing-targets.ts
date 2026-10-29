/* @layer renderer-app @kind logic */
import type { ItemTree } from './project-browser.type';

const missingTargets = (tree: ItemTree, referrers: ReadonlyMap<string, readonly string[]>): ReadonlyMap<string, readonly string[]> => {
  const found = new Map<string, string[]>();
  for (const item of tree.items.values()) {
    const id = item.role === 'ghost' ? item.row?.assetId : undefined;
    if (id === null || id === undefined) continue;
    for (const user of referrers.get(id) ?? []) found.set(user, [...(found.get(user) ?? []), item.name]);
  }
  return found;
};

export { missingTargets };
