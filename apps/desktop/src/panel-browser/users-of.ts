/* @layer renderer-app @kind logic */
import type { ItemTree } from './project-browser.type';

const usersOf = (tree: ItemTree, referrers: ReadonlyMap<string, readonly string[]>, name: string | null): ReadonlySet<string> | null => {
  if (name === null) return null;
  const needle = name.toLowerCase();
  const users = new Set<string>();
  for (const item of tree.items.values()) {
    const id = item.row?.assetId;
    if (id === null || id === undefined || item.name.toLowerCase() !== needle) continue;
    for (const user of referrers.get(id) ?? []) users.add(user);
  }
  return users;
};

export { usersOf };
