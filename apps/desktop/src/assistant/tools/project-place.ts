/* @layer renderer-app @kind logic */
import { checkRelPath, relativeInside } from '@bxel/project';
import { useProjectStore } from '../../stores/useProjectStore';
import type { ToolContext } from '../assistant.type';
import { grantedProjects } from './granted-projects';

const projectPlace = (context: ToolContext, path: string): unknown => {
  const { project } = useProjectStore.getState();
  if (!project) return null;
  for (const folder of project.folders) {
    const rel = relativeInside(folder.path, path);
    if (rel === undefined || !checkRelPath(rel).ok) continue;
    const granted = grantedProjects(context).some((each) => each.project === project);
    return granted
      ? { projectId: project.manifest.projectId, folderId: folder.folderId, path: rel }
      : { project: { name: project.manifest.name, granted: false as const } };
  }
  return null;
};

export { projectPlace };
