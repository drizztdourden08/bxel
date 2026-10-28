/* @layer renderer-app @kind logic */
import { compareEntries } from './compare-entries';
import { natural } from './natural';
import type { BrowserEntry, BrowserSort, FileEntry, FolderEntry } from './project-browser.type';

const isFolder = (entry: BrowserEntry): entry is FolderEntry => entry.kind === 'folder';

const sortEntries = (entries: readonly BrowserEntry[], sort: BrowserSort): readonly BrowserEntry[] => {
  const folders = entries.filter(isFolder).sort((left, right) => natural(left.name, right.name));
  const files = entries.filter((entry): entry is FileEntry => entry.kind === 'file').sort(compareEntries(sort.key));
  return [...folders, ...(sort.descending ? files.reverse() : files)];
};

export { sortEntries };
