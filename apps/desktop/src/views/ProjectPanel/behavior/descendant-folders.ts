/* @layer renderer-app @kind logic */
import { isExpandable } from '../../../panel-browser/is-expandable';
import type { ItemTree } from '../../../panel-browser/project-browser.type';

const descendantFolders = (tree: ItemTree, key: string): string[] => {
  const found: string[] = [];
  const queue = [...(tree.children.get(key) ?? [])];
  for (const next of queue) {
    const item = tree.items.get(next);
    if (item === undefined || !isExpandable(item)) continue;
    found.push(next);
    queue.push(...(tree.children.get(next) ?? []));
  }
  return found;
};

export { descendantFolders };
