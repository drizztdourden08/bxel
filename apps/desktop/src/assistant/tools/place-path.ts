/* @layer renderer-app @kind logic */
import { canSeeFolder, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { OpenProject } from '../../project/project.type';
import { projectPath } from './project-path';
import { TOOL_TEXT } from './tools.constants';

/** The full path of a place in a project: a folder id and a path inside it. The folder must be one the assistant may see and the owner has opened. */
const placePath = (project: OpenProject, place: { readonly folderId: string; readonly path?: string }, field: string): McpResult<string> => {
  const folder = project.folders.find((each) => each.folderId === place.folderId);
  if (!folder || !canSeeFolder(project.manifest.assistant.folders, place.folderId)) return mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.noFolder, { path: `${field}.folderId` });
  if (!folder.granted) return mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.folderNotOpen, { path: `${field}.folderId` });
  const joined = projectPath(folder.path, place.path);
  return joined.ok ? { ok: true, value: joined.value.replace(/\\/g, '/') } : { ok: false, error: { ...joined.error, path: `${field}.path` } };
};

export { placePath };
