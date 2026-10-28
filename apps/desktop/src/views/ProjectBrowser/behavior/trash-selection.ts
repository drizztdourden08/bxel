/* @layer renderer-app @kind logic */
import { trashRow } from '../../../asset-list/trash-row';
import { trashEntries } from '../../../file-ops/trash-entries';
import { pathOfEntry } from '../../../project-browser/path-of-entry';
import type { BrowserEntry, FileEntry } from '../../../project-browser/project-browser.type';

const isLoadedAsset = (entry: BrowserEntry): entry is FileEntry => entry.kind === 'file' && entry.row.loaded && entry.row.kind !== 'image' && entry.row.kind !== 'other';

const trashSelection = (entries: readonly BrowserEntry[]): void => {
  if (entries.every(isLoadedAsset)) {
    for (const entry of entries) trashRow(entry.row);
    return;
  }
  void trashEntries(entries.map(pathOfEntry).filter((path) => path !== ''));
};

export { trashSelection };
