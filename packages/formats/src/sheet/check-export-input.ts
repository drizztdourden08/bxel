/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isIntegerIn } from '../pixels/is-integer-in';
import { checkExportSprite } from './check-export-sprite';
import type { ExportSheetInput } from './export-sheet.type';
import { SHEET_LIMITS } from './sheet-limits.constants';

const checkExportInput = (input: ExportSheetInput): FormatFailure | undefined => {
  if (input.sprites.length < 1) {
    return formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, 'A sheet needs at least one sprite');
  }
  if (input.imageName.length < 1 || !isIntegerIn(input.scale, 1, SHEET_LIMITS.MAX_SCALE)) {
    return formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, 'Image name and scale (1 to 16) are required');
  }
  const names = new Set<string>();
  for (const sprite of input.sprites) {
    if (names.has(sprite.name)) {
      return formatFail(FORMAT_ERROR_CODE.SHEET_DUPLICATE_NAME, `Sprite name ${sprite.name} is used twice`);
    }
    names.add(sprite.name);
    const failure = checkExportSprite(sprite);
    if (failure) return failure;
  }
  return undefined;
};

export { checkExportInput };
