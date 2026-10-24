/* @layer renderer-app @kind logic */
import { checkRelPath, relativeInside } from '@bxel/project';
import type { OpenProject } from '../../project/project.type';
import { useProjectStore } from '../../stores/useProjectStore';
import type { ToolContext } from '../assistant.type';
import { grantedProjects } from './granted-projects';

const locate = (project: OpenProject, path: string) => {
  for (const folder of project.folders) {
    const rel = relativeInside(folder.path, path);
    if (rel !== undefined && checkRelPath(rel).ok) return { projectId: project.manifest.projectId, folderId: folder.folderId, path: rel };
  }
  return null;
};

const projectPlace = (context: ToolContext, path: string): unknown => {
  for (const { project } of grantedProjects(context)) {
    const found = locate(project, path);
    if (found) return found;
  }
  const { project } = useProjectStore.getState();
  return project && locate(project, path) ? { project: { name: project.manifest.name, granted: false as const } } : null;
};

export { projectPlace };
