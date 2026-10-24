/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { checkWrite, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import type { ExportInput, ExportTarget } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const exportTarget = (input: ExportInput, context: ToolContext): McpResult<ExportTarget> => {
  if (input.format !== 'png') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.formatMissing, { path: 'format' });
  if (!('spriteId' in input.source)) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheet, { path: 'source' });
  if (input.fileName === undefined) return hiddenFailure('project');
  const denied = checkWrite(context.settings.assistantWrite, 'assistant_folder');
  if (denied) return denied;
  const path = context.call.target;
  if (path === null) return mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.noTarget);
  return { ok: true, value: { path, source: input.source } };
};

export { exportTarget };
