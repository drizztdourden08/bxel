/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import { confirmAction, toast } from '@drizztdourden08/brock-react';
import { useFileStore } from '../stores/useFileStore';
import { PROJECT_TEXT } from './project.constants';
import type { EntryRef, ProjectOutcome } from './project.type';
import { runProjectTask } from './run-project-task';

const trashEntry = async (entry: EntryRef): Promise<ProjectOutcome | null> => {
  const path = joinInside(entry.dir, entry.name);
  if (!path.ok) return { ok: false, message: path.message };
  const sure = await confirmAction({
    title: PROJECT_TEXT.trashTitle,
    message: PROJECT_TEXT.trashMessage(entry.name, entry.kind === 'folder'),
    confirmLabel: PROJECT_TEXT.trashConfirm,
    cancelLabel: PROJECT_TEXT.cancel,
    variant: 'danger',
  });
  if (!sure) return null;
  return runProjectTask(async (documents) => {
    await documents.trash(path.value);
    useFileStore.getState().retarget(path.value, null);
    toast(PROJECT_TEXT.trashed(entry.name), { variant: 'success' });
    return { ok: true };
  });
};

export { trashEntry };
