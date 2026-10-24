/* @layer renderer-app @kind logic */
import { checkWrite, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { DocumentId } from '@bxel/document';
import type { ToolContext } from '../assistant.type';
import { inFolder } from './in-folder';
import { saveKindOf } from '../../assistant-bridge/save-kind-of';
import { projectWriteTarget } from './project-write-target';
import type { SaveInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const currentPath = (context: ToolContext, documentId: string): McpResult<string> => {
  const path = context.paths.pathOf(documentId as DocumentId);
  if (path === undefined) return mcpFailure(MCP_ERROR_CODE.NEEDS_FILE_NAME, TOOL_TEXT.needsName, { path: 'target' });
  const denied = checkWrite(context.settings.assistantWrite, inFolder(path, context.call.folder) ? 'assistant_folder' : 'own_file');
  return denied ?? { ok: true, value: path };
};

const folderPath = (context: ToolContext): McpResult<string> => {
  const denied = checkWrite(context.settings.assistantWrite, 'assistant_folder');
  if (denied) return denied;
  const target = context.call.target;
  return target === null ? mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.noTarget) : { ok: true, value: target };
};

const writePlace = async (context: ToolContext, input: SaveInput): Promise<McpResult<string>> => {
  if (input.target === 'current') return currentPath(context, input.documentId);
  if ('location' in input.target) {
    return projectWriteTarget(context, { location: input.target.location, kind: saveKindOf(input.target.location.path), overwrite: input.target.overwrite });
  }
  return folderPath(context);
};

export { writePlace };
