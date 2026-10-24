/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../stores/useProjectStore';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectFolderState } from './project.type';
import { runProjectTask } from './run-project-task';

const grantProjectFolder = async (folder: ProjectFolderState): Promise<void> => {
  const outcome = await runProjectTask(async (documents) => {
    const picked = await documents.openFolder({ title: PROJECT_TEXT.pickTitle, defaultPath: folder.path });
    if (picked === null) return null;
    if (!isSamePath(picked, folder.path)) return { ok: false, message: PROJECT_TEXT.wrongFolder(folder.name) };
    useProjectStore.getState().markGranted(folder.folderId);
    return { ok: true };
  });
  if (outcome && !outcome.ok) toast(PROJECT_TEXT.failed(outcome.message), { variant: 'danger' });
};

export { grantProjectFolder };
