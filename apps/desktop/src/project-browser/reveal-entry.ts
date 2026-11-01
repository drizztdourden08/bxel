/* @layer renderer-app @kind logic */
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import type { FileEntry } from './project-browser.type';
import { useBrowserStore } from './useBrowserStore';

const revealEntry = (entry: FileEntry): void => {
  if (entry.row.path === '') return;
  useBrowserStore.getState().reveal(parentOf(toSlashes(entry.row.path)), entry.id);
};

export { revealEntry };
