/* @layer renderer-app @kind logic */
import { checkProjectAccess, checkWrite } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { isInside } from '@bxel/project';
import type { ToolContext } from '../assistant.type';
import { openProjects } from './open-projects';
import { projectAccess } from './project-access';

const checkPathAccess = (context: ToolContext, path: string): Failure | null => {
  const owner = openProjects().find((each) => each.folders.some((folder) => isInside(path, folder.path)));
  if (!owner) return null;
  return checkProjectAccess(projectAccess(context, owner), 'edit') ?? checkWrite(context.settings.assistantWrite, 'project_file');
};

export { checkPathAccess };
