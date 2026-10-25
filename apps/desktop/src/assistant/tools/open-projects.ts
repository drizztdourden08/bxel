/* @layer renderer-app @kind logic */
import type { OpenProject } from '../../project/project.type';
import { useProjectStore } from '../../stores/useProjectStore';

const openProjects = (): readonly OpenProject[] => {
  const { project, held } = useProjectStore.getState();
  return [...(project ? [project] : []), ...held];
};

export { openProjects };
