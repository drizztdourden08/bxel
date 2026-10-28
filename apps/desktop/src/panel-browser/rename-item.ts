/* @layer renderer-app @kind logic */
import { renameRow } from '../asset-list/rename-row';
import { renameEntry } from '../project/rename-entry';
import type { ProjectOutcome } from '../project/project.type';
import { parentOf } from '../workspace/parent-of';
import type { BrowserItem } from './project-browser.type';

const renameItem = (item: BrowserItem, typed: string): Promise<ProjectOutcome> => {
  if (item.row !== null && item.role !== 'folder') return renameRow(item.row, typed);
  return renameEntry({ dir: parentOf(item.path), name: item.fileName, kind: item.kind === 'folder' ? 'folder' : 'file' }, typed);
};

export { renameItem };
