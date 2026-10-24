/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { isArtworkPath } from '../../files/is-artwork-path';
import type { ToolContext } from '../assistant.type';
import { projectFolder } from './project-folder';
import { projectPath } from './project-path';
import type { OpenTarget, ProjectLocation } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const hasFile = async (context: ToolContext, path: string): Promise<boolean> => {
  const slash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  try {
    const listing = await context.documents.list(path.slice(0, slash), { extensions: ['bxel'] });
    const name = path.slice(slash + 1).toLowerCase();
    return listing.entries.some((entry) => entry.kind === 'file' && entry.name.toLowerCase() === name);
  } catch {
    return false;
  }
};

const projectTarget = async (context: ToolContext, location: ProjectLocation): Promise<McpResult<OpenTarget>> => {
  const found = projectFolder(context, location.projectId, location.folderId);
  if (!found.ok) return found;
  const path = projectPath(found.value.folder.path, location.path);
  if (!path.ok) return path;
  if (!isArtworkPath(path.value)) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.notBxel, { path: 'file.path' });
  if (!(await hasFile(context, path.value))) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, TOOL_TEXT.noFile, { path: 'file.path' });
  return { ok: true, value: { path: path.value, viaRecent: false } };
};

export { projectTarget };
