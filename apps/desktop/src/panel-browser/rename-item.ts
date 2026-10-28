/* @layer renderer-app @kind logic */
import { renameRow } from '../asset-list/rename-row';
import { renameEntryLinked } from '../file-ops/rename-entry-linked';
import type { ProjectOutcome } from '../project/project.type';
import type { BrowserItem } from './project-browser.type';

const renameItem = async (item: BrowserItem, typed: string): Promise<ProjectOutcome> => {
  if (item.path === '') return item.row === null ? { ok: true } : renameRow(item.row, typed);
  const outcome = await renameEntryLinked(item.path, typed, item.kind === 'folder');
  return outcome.ok ? { ok: true } : { ok: false, message: outcome.message };
};

export { renameItem };
