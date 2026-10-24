/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { checkEntryName } from './check-entry-name';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';

const newProjectFolder = async (dir: string, typed: string): Promise<ProjectOutcome> => {
  const name = typed.trim();
  const outcome = await runProjectTask(async (documents) => {
    const problem = await checkEntryName(documents, dir, name);
    if (problem !== null) return { ok: false, message: problem };
    const path = joinInside(dir, name);
    if (!path.ok) return { ok: false, message: path.message };
    await documents.mkdir(path.value);
    toast(PROJECT_TEXT.folderCreated(name), { variant: 'success' });
    return { ok: true };
  });
  return outcome ?? { ok: false, message: PROJECT_TEXT.unavailable };
};

export { newProjectFolder };
