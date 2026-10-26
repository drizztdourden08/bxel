/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import type { ExportSheetInput } from './export-sheet.type';
import type { SheetMetadata } from './sheet-metadata.type';
import type { TiledSheetGrid } from './tiled-sheet-grid.type';
import { writeArraySheetJson } from './write-array-sheet-json';
import { writeBxelSheetJson } from './write-bxel-sheet-json';
import { writeHashSheetJson } from './write-hash-sheet-json';
import { IMAGE_SUFFIX, TILED_NEEDS_GRID } from './write-sheet-json.constants';
import { writeTiledSheetJson } from './write-tiled-sheet-json';

const tiledGrid = (input: ExportSheetInput): TiledSheetGrid | FormatFailure => {
  const { layout, extrude, rotate, margin } = input.settings;
  const bad = formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, TILED_NEEDS_GRID);
  if (layout.kind !== 'grid' || layout.spacingX !== layout.spacingY) return bad;
  if (input.trim || extrude !== 0 || rotate === true) return bad;
  const { scale } = input;
  return {
    tileWidth: layout.cellWidth * scale,
    tileHeight: layout.cellHeight * scale,
    spacing: layout.spacingX * scale,
    margin: margin * scale,
  };
};

const writeSheetJson = (input: ExportSheetInput, metadata: SheetMetadata): string | FormatFailure => {
  switch (input.flavour) {
    case 'hash':
      return writeHashSheetJson(metadata);
    case 'array':
      return writeArraySheetJson(metadata);
    case 'bxel':
      return writeBxelSheetJson(metadata);
    case 'tiled': {
      const grid = tiledGrid(input);
      return 'ok' in grid ? grid : writeTiledSheetJson(metadata, grid, input.imageName.replace(IMAGE_SUFFIX, ''));
    }
  }
};

export { writeSheetJson };
