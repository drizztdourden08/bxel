/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isIntegerIn } from '../pixels/is-integer-in';
import { checkExportSprites } from './check-export-sprites';
import type { ExportSheetInput } from './export-sheet.type';
import { SHEET_LIMITS } from './sheet-limits.constants';

const checkExportInput = (input: ExportSheetInput): FormatFailure | undefined => {
  if (input.sprites.length >= 1 && (input.imageName.length < 1 || !isIntegerIn(input.scale, 1, SHEET_LIMITS.MAX_SCALE))) {
    return formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, 'Image name and scale (1 to 16) are required');
  }
  return checkExportSprites(input.sprites);
};

export { checkExportInput };
