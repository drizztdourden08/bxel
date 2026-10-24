/* @layer renderer-app @kind logic */
import { canSeeFolder } from '@bxel/mcp';
import { checkRelPath, relativeInside } from '@bxel/project';
import type { OpenProject } from '../../project/project.type';
import type { ProjectLocation } from './tool-input.type';

const locateInProject = (project: OpenProject, path: string): ProjectLocation | null => {
  for (const folder of project.folders) {
    const rel = relativeInside(folder.path, path);
    if (rel !== undefined && checkRelPath(rel).ok && canSeeFolder(project.manifest.assistant.folders, folder.folderId)) {
      return { projectId: project.manifest.projectId, folderId: folder.folderId, path: rel };
    }
  }
  return null;
};

export { locateInProject };
