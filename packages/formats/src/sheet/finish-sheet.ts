/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { encodePngRgba } from '../encode-png-rgba';
import { upscaleRgba } from '../upscale-rgba';
import { buildPlacements } from './build-placements';
import { buildSheetMetadata } from './build-sheet-metadata';
import type { ExportSheetInput, ExportSheetResult, SheetCell } from './export-sheet.type';
import { packedCells } from './packed-cells';
import { renderSheet } from './render-sheet';
import { scaleMetadata } from './scale-metadata';
import { SHEET_LIMITS } from './sheet-limits.constants';
import type { PackedSheet } from './sheet.type';
import { writeSheetJson } from './write-sheet-json';

const finishSheet = (input: ExportSheetInput, cells: readonly SheetCell[], packed: PackedSheet): ExportSheetResult => {
  if (Math.max(packed.width, packed.height) * input.scale > SHEET_LIMITS.MAX_SIDE) {
    return formatFail(FORMAT_ERROR_CODE.SHEET_TOO_LARGE, 'The scaled sheet is too large');
  }
  const flat = renderSheet(packed, buildPlacements(packed.items, packedCells(cells)), input.settings.extrude);
  const image = input.scale === 1 ? flat : upscaleRgba(flat, input.scale);
  const png = encodePngRgba(image);
  if (!png.ok) return formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, png.message);
  const metadata = scaleMetadata(buildSheetMetadata(input, cells, packed), input.scale);
  const json = writeSheetJson(input, metadata);
  if (typeof json !== 'string') return json;
  return { ok: true, image, png: png.bytes, json, metadata };
};

export { finishSheet };
