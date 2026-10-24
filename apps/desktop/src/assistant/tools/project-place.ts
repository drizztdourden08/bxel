/* @layer renderer-app @kind logic */
import { useProjectStore } from '../../stores/useProjectStore';
import type { ToolContext } from '../assistant.type';
import { grantedProjects } from './granted-projects';
import { locateInProject } from './locate-in-project';

const projectPlace = (context: ToolContext, path: string): unknown => {
  for (const { project } of grantedProjects(context)) {
    const found = locateInProject(project, path);
    if (found) return found;
  }
  const { project } = useProjectStore.getState();
  return project && locateInProject(project, path) ? { project: { name: project.manifest.name, granted: false as const } } : null;
};

export { projectPlace };
