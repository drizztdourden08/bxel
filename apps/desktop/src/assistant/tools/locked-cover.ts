/* @layer renderer-app @kind logic */
import type { FolderCover, ToolContext } from '../assistant.type';
import { openProjects } from './open-projects';
import { projectAccess } from './project-access';

const lockedCover = (context: ToolContext): FolderCover => {
  const locked = openProjects().filter((project) => projectAccess(context, project) === 'read');
  return { folders: locked.flatMap((project) => project.folders.map((folder) => folder.path)), projectFiles: locked.map((project) => project.projectFile) };
};

export { lockedCover };
