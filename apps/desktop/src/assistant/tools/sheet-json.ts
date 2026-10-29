/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { sheetFilesOf } from './sheet-files-of';
import type { SheetPicture } from './sheet-png.type';
import { TOOL_TEXT } from './tools.constants';

const sheetJson = (picture: SheetPicture): McpResult<Uint8Array> => {
  const found = sheetFilesOf({ ...picture, exported: true });
  if (!found.ok) return found;
  const { image, json } = found.value;
  if (!json) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
  if ((image.width ?? 0) > RENDER_SIDE_MAX || (image.height ?? 0) > RENDER_SIDE_MAX) {
    return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  }
  const made = json.make();
  if (!made.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, made.message);
  if (made.data.kind !== 'text') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
  return { ok: true, value: new TextEncoder().encode(made.data.text) };
};

export { sheetJson };
