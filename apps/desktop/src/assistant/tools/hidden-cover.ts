/* @layer renderer-app @kind logic */
import { canSeeFolder } from '@bxel/mcp';
import type { OpenProject } from '../../project/project.type';
import type { FolderCover, ToolContext } from '../assistant.type';
import { openProjects } from './open-projects';
import { projectAccess } from './project-access';

const foldersOf = (context: ToolContext, project: OpenProject): readonly string[] =>
  projectAccess(context, project) === 'off'
    ? project.folders.map((folder) => folder.path)
    : project.folders.filter((folder) => !canSeeFolder(project.manifest.assistant.folders, folder.folderId)).map((folder) => folder.path);

const hiddenCover = (context: ToolContext): FolderCover => {
  const projects = openProjects();
  return {
    folders: projects.flatMap((project) => foldersOf(context, project)),
    projectFiles: projects.filter((project) => projectAccess(context, project) === 'off').map((project) => project.projectFile),
  };
};

export { hiddenCover };
