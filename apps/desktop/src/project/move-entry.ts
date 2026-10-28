/* @layer renderer-app @kind logic */
import { isSamePath, joinInside, relativeInside } from '@bxel/project';
import { fileName } from '../files/file-name';
import { useFileStore } from '../stores/useFileStore';
import { followFileRename } from '../workspace/follow-file-rename';
import { parentOf } from '../workspace/parent-of';
import { checkEntryName } from './check-entry-name';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';

const moveEntry = async (from: string, toDir: string): Promise<ProjectOutcome> => {
  const name = fileName(from);
  const to = joinInside(toDir, name);
  if (!to.ok) return { ok: false, message: to.message };
  if (isSamePath(parentOf(from), toDir)) return { ok: true };
  if (relativeInside(from, toDir) !== undefined) return { ok: false, message: PROJECT_TEXT.moveIntoSelf(name) };
  const outcome = await runProjectTask(async (documents) => {
    const problem = await checkEntryName(documents, toDir, name);
    if (problem !== null) return { ok: false, message: problem };
    await documents.rename(from, to.value);
    useFileStore.getState().retarget(from, to.value);
    followFileRename(from, to.value);
    return { ok: true };
  });
  return outcome ?? { ok: false, message: PROJECT_TEXT.unavailable };
};

export { moveEntry };
