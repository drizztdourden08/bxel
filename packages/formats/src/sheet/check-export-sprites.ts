/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { checkExportSprite } from './check-export-sprite';
import type { ExportSprite } from './export-sheet.type';

const checkExportSprites = (sprites: readonly ExportSprite[]): FormatFailure | undefined => {
  if (sprites.length < 1) {
    return formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, 'A sheet needs at least one sprite');
  }
  const names = new Set<string>();
  for (const sprite of sprites) {
    if (names.has(sprite.name)) {
      return formatFail(FORMAT_ERROR_CODE.SHEET_DUPLICATE_NAME, `Sprite name ${sprite.name} is used twice`);
    }
    names.add(sprite.name);
    const failure = checkExportSprite(sprite);
    if (failure) return failure;
  }
  return undefined;
};

export { checkExportSprites };
