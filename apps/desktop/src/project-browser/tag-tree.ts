/* @layer renderer-app @kind logic */
import { BROWSER_TEXT } from './project-browser.constants';
import type { FolderNode } from './project-browser.type';

const tagTree = (counts: ReadonlyMap<string, number>): FolderNode => ({
  key: 'tags',
  label: BROWSER_TEXT.tags,
  children: [],
  items: [...counts].sort(([left], [right]) => left.localeCompare(right)).map(([tag, count]) => ({ key: tag, label: tag, icon: 'tag', count })),
});

export { tagTree };
