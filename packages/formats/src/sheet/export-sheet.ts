/* @layer core @kind logic */
import { buildSheetCells } from './build-sheet-cells';
import { checkExportInput } from './check-export-input';
import type { ExportSheetInput, ExportSheetResult } from './export-sheet.type';
import { finishSheet } from './finish-sheet';
import { packedCells } from './packed-cells';
import { packSheet } from './pack-sheet';
import { shouldMerge } from './should-merge';

const exportSheet = (input: ExportSheetInput): ExportSheetResult => {
  const invalid = checkExportInput(input);
  if (invalid) return invalid;
  const cells = buildSheetCells(input.sprites, input.trim, shouldMerge(input));
  const items = packedCells(cells).map((cell) => ({
    key: cell.key,
    width: cell.trimmed.image.width,
    height: cell.trimmed.image.height,
  }));
  const packed = packSheet(items, input.settings);
  return packed.ok ? finishSheet(input, cells, packed) : packed;
};

export { exportSheet };
