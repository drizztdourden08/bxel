/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { ghostItem } from './ghost-item';
import type { BrowserItem } from './project-browser.type';
import { rootOf } from './root-of';

const nearestFolder = (path: string, byLower: ReadonlyMap<string, string>, root: string): string => {
  let folder = parentOf(path);
  while (folder.length > root.length) {
    const known = byLower.get(folder.toLowerCase());
    if (known !== undefined) return known;
    folder = parentOf(folder);
  }
  return root;
};

const ghostItems = (rows: readonly AssetRow[], known: ReadonlyMap<string, string>, roots: readonly string[]): readonly BrowserItem[] =>
  rows.flatMap((row) => {
    const path = toSlashes(row.path);
    const root = row.loaded && !row.dirty && path !== '' && !known.has(path.toLowerCase()) ? rootOf(path, roots) : undefined;
    return root === undefined ? [] : [ghostItem({ ...row, path }, nearestFolder(path, known, root), root)];
  });

export { ghostItems };
