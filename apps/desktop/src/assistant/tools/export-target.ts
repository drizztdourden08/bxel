/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { checkWrite, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { projectWriteTarget } from './project-write-target';
import type { ExportInput, ExportTarget } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const folderTarget = (input: ExportInput, context: ToolContext): McpResult<string> => {
  if (input.fileName === undefined) return hiddenFailure('project');
  const denied = checkWrite(context.settings.assistantWrite, 'assistant_folder');
  if (denied) return denied;
  const path = context.call.target;
  return path === null ? mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.noTarget) : { ok: true, value: path };
};

const exportTarget = async (input: ExportInput, context: ToolContext): Promise<McpResult<ExportTarget>> => {
  if (input.format !== 'png') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.formatMissing, { path: 'format' });
  if (!('spriteId' in input.source)) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheet, { path: 'source' });
  const path = input.location
    ? await projectWriteTarget(context, { location: input.location, kind: 'png', overwrite: input.overwrite ?? false })
    : folderTarget(input, context);
  return path.ok ? { ok: true, value: { path: path.value, source: input.source } } : path;
};

export { exportTarget };
