/* @layer renderer-app @kind logic */
import { confirmAction, toast } from '@drizztdourden08/brock-react';
import { useFileStore } from '../stores/useFileStore';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';

const trashEntries = async (paths: readonly string[], label: string): Promise<ProjectOutcome | null> => {
  const sure = await confirmAction({
    title: PROJECT_TEXT.trashTitle,
    message: paths.length === 1 ? PROJECT_TEXT.trashMessage(label, false) : PROJECT_TEXT.trashManyMessage(paths.length),
    confirmLabel: PROJECT_TEXT.trashConfirm,
    cancelLabel: PROJECT_TEXT.cancel,
    variant: 'danger',
  });
  if (!sure) return null;
  return runProjectTask(async (documents) => {
    for (const path of paths) {
      await documents.trash(path);
      useFileStore.getState().retarget(path, null);
    }
    toast(paths.length === 1 ? PROJECT_TEXT.trashed(label) : PROJECT_TEXT.trashedMany(paths.length), { variant: 'success' });
    return { ok: true };
  });
};

export { trashEntries };
