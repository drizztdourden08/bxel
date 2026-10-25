/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../stores/useProjectStore';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';

const reportProjectOutcome = (outcome: ProjectOutcome | null): void => {
  if (outcome === null) return;
  if (outcome.ok) toast(PROJECT_TEXT.opened(useProjectStore.getState().project?.manifest.name ?? ''), { variant: 'success' });
  else toast(PROJECT_TEXT.failed(outcome.message), { variant: 'danger' });
};

export { reportProjectOutcome };
