/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { useFileStore } from '../stores/useFileStore';
import { checkEntryName } from './check-entry-name';
import { endingOf } from './ending-of';
import { PROJECT_TEXT } from './project.constants';
import type { EntryRef, ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';

const keepsEnding = (entry: EntryRef, name: string): boolean => entry.kind === 'folder' || endingOf(entry.name) === endingOf(name);

const renameEntry = async (entry: EntryRef, typed: string): Promise<ProjectOutcome> => {
  const name = typed.trim();
  if (name === entry.name) return { ok: true };
  if (!keepsEnding(entry, name)) return { ok: false, message: PROJECT_TEXT.keepExtension(endingOf(entry.name)) };
  const from = joinInside(entry.dir, entry.name);
  if (!from.ok) return { ok: false, message: from.message };
  const to = joinInside(entry.dir, name);
  if (!to.ok) return { ok: false, message: to.message };
  const outcome = await runProjectTask(async (documents) => {
    const problem = await checkEntryName(documents, entry.dir, name, entry.name);
    if (problem !== null) return { ok: false, message: problem };
    await documents.rename(from.value, to.value);
    useFileStore.getState().retarget(from.value, to.value);
    toast(PROJECT_TEXT.renamed(name), { variant: 'success' });
    return { ok: true };
  });
  return outcome ?? { ok: false, message: PROJECT_TEXT.unavailable };
};

export { renameEntry };
