/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { sheetFilesOf } from './sheet-files-of';
import type { SheetPicture } from './sheet-png.type';
import type { FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const sheetPng = (picture: SheetPicture): McpResult<FramePng> => {
  const found = sheetFilesOf(picture);
  if (!found.ok) return found;
  const { image } = found.value;
  const { width, height } = image;
  if (width === null || height === null) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
  if (width > RENDER_SIDE_MAX || height > RENDER_SIDE_MAX) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  const made = image.make();
  if (!made.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, made.message);
  if (made.data.kind !== 'bytes') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
  return { ok: true, value: { bytes: made.data.bytes, width, height } };
};

export { sheetPng };
