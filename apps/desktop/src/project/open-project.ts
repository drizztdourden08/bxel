/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../stores/useProjectStore';
import { activateProject } from './activate-project';
import { pickProjectFolder } from './pick-project-folder';
import { PROJECT_TEXT } from './project.constants';
import { readProjectFolder } from './read-project-folder';
import { runProjectTask } from './run-project-task';

const openProject = async (startAt?: string): Promise<void> => {
  const outcome = await runProjectTask(async (documents) => {
    const folder = await pickProjectFolder(documents, startAt);
    if (folder === null) return null;
    const loaded = await readProjectFolder(documents, folder);
    if (!loaded.ok) return { ok: false, message: loaded.message };
    return activateProject(documents, folder, loaded.value);
  });
  if (outcome === null) return;
  if (outcome.ok) toast(PROJECT_TEXT.opened(useProjectStore.getState().project?.manifest.name ?? ''), { variant: 'success' });
  else toast(PROJECT_TEXT.failed(outcome.message), { variant: 'danger' });
};

export { openProject };
