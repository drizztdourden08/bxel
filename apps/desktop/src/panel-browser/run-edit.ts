/* @layer renderer-app @kind logic */
import { newProjectFile } from '../project/new-project-file';
import type { ProjectOutcome } from '../project/project.type';
import type { EditTarget } from './browser-state.type';
import { renameItem } from './rename-item';
import type { BrowserItem } from './project-browser.type';

const runEdit = (target: EditTarget, typed: string, itemOf: (key: string) => BrowserItem | undefined): Promise<ProjectOutcome> | ProjectOutcome => {
  if (target.kind === 'create') return newProjectFile(itemOf(target.parentKey)?.path ?? '', typed);
  const item = itemOf(target.key);
  return item ? renameItem(item, typed) : { ok: true };
};

export { runEdit };
