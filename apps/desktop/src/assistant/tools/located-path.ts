/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { fileExists } from './file-exists';
import { projectFolder } from './project-folder';
import { projectPath } from './project-path';
import type { ProjectLocation } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const locatedPath = async (context: ToolContext, location: ProjectLocation, supported: (path: string) => boolean, unsupported: string): Promise<McpResult<string>> => {
  const found = projectFolder(context, location.projectId, location.folderId);
  if (!found.ok) return found;
  const path = projectPath(found.value.folder.path, location.path);
  if (!path.ok) return path;
  if (!supported(path.value)) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, unsupported, { path: 'file.path' });
  if (!(await fileExists(context.documents, path.value))) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, TOOL_TEXT.noFile, { path: 'file.path' });
  return path;
};

export { locatedPath };
