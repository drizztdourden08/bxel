/* @layer renderer-app @kind logic */
import type { ItemTree } from './project-browser.type';

const ancestorsOf = (tree: ItemTree, key: string): readonly string[] => {
  const found: string[] = [];
  for (let at = tree.items.get(key)?.parentKey ?? null; at !== null; at = tree.items.get(at)?.parentKey ?? null) found.push(at);
  return found;
};

export { ancestorsOf };
