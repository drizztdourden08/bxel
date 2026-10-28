/* @layer renderer-app @kind logic */
import { relativeInside } from '@bxel/project';
import type { BrowserItem } from './project-browser.type';

const relativePathOf = (item: BrowserItem | undefined): string => {
  if (item === undefined || item.path === '' || item.rootKey === null) return '';
  return relativeInside(item.rootKey, item.path) ?? '';
};

export { relativePathOf };
