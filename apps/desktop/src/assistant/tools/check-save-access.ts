/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { checkProjectAccess, checkWrite, effectiveAccess } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { isSamePath } from '@bxel/project';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import type { ToolContext } from '../assistant.type';
import { grantedProjects } from './granted-projects';

const checkSaveAccess = (context: ToolContext, documentId: DocumentId): Failure | null => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  if (workspace?.kind !== 'project') return null;
  const found = grantedProjects(context).find((each) => isSamePath(each.project.projectFile, workspace.projectFile ?? ''));
  const level = found ? effectiveAccess(context.call.session.mode, found.access) : 'off';
  return checkProjectAccess(level, 'edit') ?? checkWrite(context.settings.assistantWrite, 'project_file');
};

export { checkSaveAccess };
