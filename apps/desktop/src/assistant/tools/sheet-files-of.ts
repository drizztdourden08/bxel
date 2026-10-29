/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { DEFAULT_EXPORT_SETTINGS } from '../../export/export.constants';
import type { ExportSettings } from '../../export/export.type';
import { planExport } from '../../export/plan-export';
import { atlasExportSettings } from '../../sheet-manager/atlas-export-settings';
import { MANAGER_DEFAULTS } from '../../stores/manager-store.constants';
import type { SheetFiles, SheetPicture } from './sheet-png.type';
import { TOOL_TEXT } from './tools.constants';

const sheetFilesOf = (picture: SheetPicture): McpResult<SheetFiles> => {
  const { artwork, revision, sheetId, scale, hidden, exported } = picture;
  const sheet = hidden.has(sheetId) ? undefined : artwork.sheets.find((each) => each.id === sheetId);
  if (!sheet || sheet.entries.some((entry) => hidden.has(entry.spriteId))) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noSheetFound);
  const packed: Partial<ExportSettings> =
    exported === true ? { ...atlasExportSettings(sheet, MANAGER_DEFAULTS.atlas), scale } : { kind: 'sheet', sprites: 'sheet', sheetId, scale };
  const plan = planExport({ frozen: { revision, artwork }, settings: { ...DEFAULT_EXPORT_SETTINGS, ...packed }, selectedIds: [] });
  if (plan.problem !== null) return mcpFailure(ERROR_CODE.INVALID_OPTION, plan.problem, { path: 'source' });
  const image = plan.files.find((each) => each.width !== null);
  if (!image) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheetImage, { path: 'source' });
  return { ok: true, value: { image, json: plan.files.find((each) => each.name.toLowerCase().endsWith('.json')) } };
};

export { sheetFilesOf };
