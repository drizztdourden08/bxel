/* @layer renderer-app @kind logic */
import { useProjectStore } from '../stores/useProjectStore';
import { closeProject } from './close-project';
import type { ProjectIdentity } from './project.type';
import { sameProject } from './same-project';

const leaveProject = async (next: ProjectIdentity | null): Promise<boolean> => {
  const { project } = useProjectStore.getState();
  if (!project || (next !== null && sameProject(project, next))) return true;
  return closeProject();
};

export { leaveProject };
