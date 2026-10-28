/* @layer renderer-app @kind logic */
import type { FileEntry, FolderNode } from './project-browser.type';

const pinnedTree = (entries: readonly FileEntry[]): FolderNode => ({
  key: 'pinned',
  label: 'Pinned',
  children: [],
  items: entries.map((entry) => ({ key: entry.id, label: entry.row.name, icon: 'pin', count: null })),
});

export { pinnedTree };
