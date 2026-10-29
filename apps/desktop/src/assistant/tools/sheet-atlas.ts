/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { plannedSheet } from './sheet-png';
import type { SheetPicture } from './sheet-png.type';
import { TOOL_TEXT } from './tools.constants';

const sheetAtlas = (picture: SheetPicture): McpResult<Uint8Array> => {
  const planned = plannedSheet(picture);
  if (!planned.ok) return planned;
  const made = planned.value.find((each) => each.width === null)?.make();
  if (!made?.ok || made.data.kind !== 'text') return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
  return { ok: true, value: new TextEncoder().encode(made.data.text) };
};

export { sheetAtlas };
