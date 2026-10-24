/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../stores/useProjectStore';
import { openProjectAt } from './open-project-at';
import { pickAndActivate } from './pick-and-activate';
import { PROJECT_TEXT } from './project.constants';
import { runProjectTask } from './run-project-task';

const openProject = async (startAt?: string, direct = false): Promise<void> => {
  const outcome = await runProjectTask((documents) =>
    direct && startAt !== undefined ? openProjectAt(documents, startAt) : pickAndActivate(documents, startAt),
  );
  if (outcome === null) return;
  if (outcome.ok) toast(PROJECT_TEXT.opened(useProjectStore.getState().project?.manifest.name ?? ''), { variant: 'success' });
  else toast(PROJECT_TEXT.failed(outcome.message), { variant: 'danger' });
};

export { openProject };
