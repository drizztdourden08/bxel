/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useProjectSetsStore } from '../stores/useProjectSetsStore';
import { useProjectStore } from '../stores/useProjectStore';
import { PROJECT_TEXT } from './project.constants';

const closeProject = (): void => {
  const { project, close } = useProjectStore.getState();
  if (!project) return;
  close();
  useProjectSetsStore.getState().close();
  toast(PROJECT_TEXT.closed(project.manifest.name), { variant: 'info' });
};

export { closeProject };
