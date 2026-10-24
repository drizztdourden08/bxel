/* @layer renderer-app @kind logic */
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { FoundFolder, ToolContext } from '../assistant.type';
import { grantedProjects } from './granted-projects';
import { TOOL_TEXT } from './tools.constants';

const projectFolder = (context: ToolContext, projectId: string, folderId: string): McpResult<FoundFolder> => {
  const found = grantedProjects(context).find((each) => each.project.manifest.projectId === projectId);
  if (!found) return hiddenFailure('project');
  const folder = found.project.folders.find((each) => each.folderId === folderId);
  if (!folder) return mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.noFolder, { path: 'folderId' });
  if (!folder.granted) return mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.folderNotOpen, { path: 'folderId' });
  return { ok: true, value: { ...found, folder } };
};

export { projectFolder };
