/* @layer renderer-app @kind logic */
import { checkProjectAccess, checkWrite, effectiveAccess, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { fileExists } from './file-exists';
import { makeParents } from './make-parents';
import { projectFolder } from './project-folder';
import { projectPath } from './project-path';
import type { ProjectWrite } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const projectWriteTarget = async (context: ToolContext, { location, kind, overwrite }: ProjectWrite): Promise<McpResult<string>> => {
  const found = projectFolder(context, location.projectId, location.folderId);
  if (!found.ok) return found;
  const level = effectiveAccess(context.call.session.mode, found.value.access);
  const denied = checkProjectAccess(level, 'edit') ?? checkWrite(context.settings.assistantWrite, 'project_file');
  if (denied) return denied;
  const path = projectPath(found.value.folder.path, location.path, kind);
  if (!path.ok) return path;
  if (!overwrite && (await fileExists(context.documents, path.value))) {
    return mcpFailure(MCP_ERROR_CODE.FILE_EXISTS, TOOL_TEXT.fileExists, { path: 'location.path' });
  }
  return (await makeParents(context.documents, found.value.folder.path, path.value)) ?? path;
};

export { projectWriteTarget };
