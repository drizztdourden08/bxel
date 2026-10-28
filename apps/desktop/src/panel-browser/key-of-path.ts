/* @layer renderer-app @kind logic */
import { toSlashes } from '../workspace/to-slashes';
import type { ItemTree } from './project-browser.type';

const keyOfPath = (tree: ItemTree, path: string | undefined): string | null => {
  if (path === undefined) return null;
  const wanted = toSlashes(path).replace(/\/+$/, '').toLowerCase();
  for (const key of tree.items.keys()) if (key.toLowerCase() === wanted) return key;
  return null;
};

export { keyOfPath };
