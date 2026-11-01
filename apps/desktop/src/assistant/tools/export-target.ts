/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { EXPORT_FORMAT_VALUES, mcpFailure } from '@bxel/mcp';
import type { Failure, McpResult } from '@bxel/mcp';
import type { FileKind } from '@bxel/project';
import type { ToolContext } from '../assistant.type';
import { folderTarget } from './folder-target';
import { projectWriteTarget } from './project-write-target';
import type { ExportInput, ExportTarget } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const formatProblem = ({ source, format }: ExportInput): Failure | null => {
  if (!EXPORT_FORMAT_VALUES.some((each) => each === format)) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.formatMissing, { path: 'format' });
  if ('spriteId' in source && format === 'gif') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.gifSprite, { path: 'format' });
  if ('sheetId' in source && format !== 'png' && format !== 'atlas-json') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.sheetFormat, { path: 'format' });
  if (!('sheetId' in source) && format === 'atlas-json') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.atlasSource, { path: 'format' });
  return null;
};

const kindOf = (format: string): FileKind => {
  if (format === 'gif') return 'gif';
  return format === 'atlas-json' ? 'sheet' : 'png';
};

const exportTarget = async (input: ExportInput, context: ToolContext): Promise<McpResult<ExportTarget>> => {
  const problem = formatProblem(input);
  if (problem) return problem;
  const kind = kindOf(input.format);
  const path = input.location
    ? await projectWriteTarget(context, { location: input.location, kind, overwrite: input.overwrite ?? false })
    : folderTarget(input, context);
  return path.ok ? { ok: true, value: { path: path.value, source: input.source } } : path;
};

export { exportTarget };
