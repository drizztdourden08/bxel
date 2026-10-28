/* @layer renderer-app @kind logic */
import { compareNames } from './compare-names';
import type { BrowserItem } from './project-browser.type';

const isFolderLike = (item: BrowserItem): boolean => item.role === 'folder' || item.role === 'linked' || item.role === 'group';

const sortChildren = (keys: readonly string[], items: ReadonlyMap<string, BrowserItem>): readonly string[] =>
  [...keys].sort((left, right) => {
    const first = items.get(left);
    const second = items.get(right);
    if (first === undefined || second === undefined) return 0;
    const folders = Number(isFolderLike(second)) - Number(isFolderLike(first));
    return folders || compareNames(first.name, second.name);
  });

export { sortChildren };
