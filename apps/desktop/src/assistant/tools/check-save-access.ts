/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { checkProjectAccess, checkWrite, effectiveAccess } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { isInside } from '@bxel/project';
import type { OpenProject } from '../../project/project.type';
import { sameProject } from '../../project/same-project';
import { useProjectStore } from '../../stores/useProjectStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import type { ToolContext } from '../assistant.type';
import { grantedProjects } from './granted-projects';

const filesOf = (context: ToolContext, documentId: DocumentId): readonly string[] => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const own = context.paths.pathOf(documentId);
  return [...(workspace ? [...workspace.paths.values()] : []), ...(own === undefined ? [] : [own])];
};

const ownerOf = (path: string): OpenProject | undefined => {
  const { project, held } = useProjectStore.getState();
  return [...(project ? [project] : []), ...held].find((each) => each.folders.some((folder) => isInside(path, folder.path)));
};

const checkSaveAccess = (context: ToolContext, documentId: DocumentId): Failure | null => {
  const owners = filesOf(context, documentId).flatMap((path) => ownerOf(path) ?? []);
  for (const owner of owners) {
    const found = grantedProjects(context).find((each) => sameProject(each.project, owner));
    const level = found ? effectiveAccess(context.call.session.mode, found.access) : 'off';
    const denied = checkProjectAccess(level, 'edit') ?? checkWrite(context.settings.assistantWrite, 'project_file');
    if (denied) return denied;
  }
  return null;
};

export { checkSaveAccess };
