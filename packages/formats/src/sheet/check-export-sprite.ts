/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isIntegerIn } from '../pixels/is-integer-in';
import { PNG_LIMITS } from '../png-limits.constants';
import { checkExportFrame } from './check-export-frame';
import type { ExportSprite } from './export-sheet.type';
import { SHEET_LIMITS } from './sheet-limits.constants';

const bad = (message: string): FormatFailure =>
  formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, message);

const checkExportShape = (sprite: ExportSprite, entries: number): FormatFailure | undefined => {
  const side = SHEET_LIMITS.MAX_SIDE;
  if (sprite.name.length < 1) return bad('Sprite names must not be empty');
  if (!isIntegerIn(sprite.width, 1, side) || !isIntegerIn(sprite.height, 1, side)) {
    return bad(`${sprite.name}: sprite size must be integers 1 to ${side}`);
  }
  if (!isIntegerIn(entries, 1, PNG_LIMITS.PALETTE_MAX_ENTRIES)) {
    return bad(`${sprite.name}: palette must hold 1 to 256 RGBA entries`);
  }
  if (sprite.frames.length < 1) return bad(`${sprite.name}: a sprite needs at least one frame`);
  const lastFrame = sprite.frames.length - 1;
  const tagsFit = sprite.tags.every((tag) => isIntegerIn(tag.from, 0, tag.to) && tag.to <= lastFrame);
  return tagsFit ? undefined : bad(`${sprite.name}: a tag lies outside the frames`);
};

const checkExportSprite = (sprite: ExportSprite): FormatFailure | undefined => {
  const entries = sprite.palette.length / 4;
  const invalid = checkExportShape(sprite, entries);
  if (invalid) return invalid;
  for (const frame of sprite.frames) {
    const failure = checkExportFrame(frame, sprite.width * sprite.height, entries);
    if (failure) return failure;
  }
  return undefined;
};

export { checkExportSprite };
