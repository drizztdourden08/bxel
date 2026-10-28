/* @layer renderer-app @kind logic */
import type { FolderNode, SavedFilter } from './project-browser.type';

const filterTree = (filters: readonly SavedFilter[], counts: ReadonlyMap<string, number>): FolderNode => ({
  key: 'filters',
  label: 'Smart filters',
  children: [],
  items: filters.map((filter) => ({ key: filter.id, label: filter.name, icon: 'filter', count: counts.get(filter.id) ?? 0 })),
});

export { filterTree };
