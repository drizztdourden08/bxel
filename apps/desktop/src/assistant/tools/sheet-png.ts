/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { DEFAULT_EXPORT_SETTINGS } from '../../export/export.constants';
import type { PlannedFile } from '../../export/export.type';
import { planExport } from '../../export/plan-export';
import type { SheetPicture } from './sheet-png.type';
import type { FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const imageOf = (picture: SheetPicture): McpResult<PlannedFile> => {
  const { artwork, revision, sheetId, scale, hidden } = picture;
  const sheet = hidden.has(sheetId) ? undefined : artwork.sheets.find((each) => each.id === sheetId);
  if (!sheet || sheet.entries.some((entry) => hidden.has(entry.spriteId))) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noSheetFound);
  const settings = { ...DEFAULT_EXPORT_SETTINGS, kind: 'sheet', sprites: 'sheet', sheetId, scale } as const;
  const plan = planExport({ frozen: { revision, artwork }, settings, selectedIds: [] });
  if (plan.problem !== null) return mcpFailure(ERROR_CODE.INVALID_OPTION, plan.problem, { path: 'source' });
  const file = plan.files.find((each) => each.width !== null);
  return file ? { ok: true, value: file } : mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
};

const sheetPng = (picture: SheetPicture): McpResult<FramePng> => {
  const found = imageOf(picture);
  if (!found.ok) return found;
  const { width, height } = found.value;
  if (width === null || height === null) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
  if (width > RENDER_SIDE_MAX || height > RENDER_SIDE_MAX) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  const made = found.value.make();
  if (!made.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, made.message);
  if (made.data.kind !== 'bytes') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
  return { ok: true, value: { bytes: made.data.bytes, width, height } };
};

export { sheetPng };
