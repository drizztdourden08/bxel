/* @layer renderer-app @kind logic */
import { checkWrite, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { TOOL_TEXT } from './tools.constants';

const folderTarget = (input: { readonly fileName?: string }, context: ToolContext): McpResult<string> => {
  if (input.fileName === undefined) return hiddenFailure('project');
  const denied = checkWrite(context.settings.assistantWrite, 'assistant_folder');
  if (denied) return denied;
  const path = context.call.target;
  return path === null ? mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.noTarget) : { ok: true, value: path };
};

export { folderTarget };
