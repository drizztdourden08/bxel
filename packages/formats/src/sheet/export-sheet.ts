/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { encodePngRgba } from '../encode-png-rgba';
import { upscaleRgba } from '../upscale-rgba';
import { buildSheetCells } from './build-sheet-cells';
import { buildSheetMetadata } from './build-sheet-metadata';
import { checkExportInput } from './check-export-input';
import type { ExportSheetInput, ExportSheetResult } from './export-sheet.type';
import { packSheet } from './pack-sheet';
import { renderSheet } from './render-sheet';
import { scaleMetadata } from './scale-metadata';
import { SHEET_LIMITS } from './sheet-limits.constants';
import { writeBxelSheetJson } from './write-bxel-sheet-json';
import { writeHashSheetJson } from './write-hash-sheet-json';

const exportSheet = (input: ExportSheetInput): ExportSheetResult => {
  const invalid = checkExportInput(input);
  if (invalid) return invalid;
  const cells = buildSheetCells(input.sprites, input.trim);
  const items = cells.map((cell) => ({
    key: cell.key,
    width: cell.trimmed.image.width,
    height: cell.trimmed.image.height,
  }));
  const packed = packSheet(items, input.settings);
  if (!packed.ok) return packed;
  if (Math.max(packed.width, packed.height) * input.scale > SHEET_LIMITS.MAX_SIDE) {
    return formatFail(FORMAT_ERROR_CODE.SHEET_TOO_LARGE, 'The scaled sheet is too large');
  }
  const placements = packed.items.flatMap((box, i) => {
    const cell = cells[i];
    return cell ? [{ box, image: cell.trimmed.image }] : [];
  });
  const flat = renderSheet(packed, placements, input.settings.extrude);
  const image = input.scale === 1 ? flat : upscaleRgba(flat, input.scale);
  const png = encodePngRgba(image);
  if (!png.ok) return formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, png.message);
  const metadata = scaleMetadata(buildSheetMetadata(input, cells, packed), input.scale);
  const json = input.flavour === 'hash' ? writeHashSheetJson(metadata) : writeBxelSheetJson(metadata);
  return { ok: true, image, png: png.bytes, json, metadata };
};

export { exportSheet };
