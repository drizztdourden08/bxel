/* @layer renderer-app @kind logic */
import { checkWrite } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { isInside } from '@bxel/project';
import type { ToolContext } from '../assistant.type';
import { checkPathAccess } from './check-path-access';
import { inFolder } from './in-folder';
import { openProjects } from './open-projects';

const checkNewPath = (context: ToolContext, path: string): Failure | null => {
  if (inFolder(path, context.call.folder)) return checkWrite(context.settings.assistantWrite, 'assistant_folder');
  const inProject = openProjects().some((project) => project.folders.some((folder) => isInside(path, folder.path)));
  return inProject ? checkPathAccess(context, path) : checkWrite(context.settings.assistantWrite, 'own_file');
};

export { checkNewPath };
