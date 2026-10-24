/* @layer renderer-app @kind logic */
import { MIN_SHEET_SPRITES, SHEET_TEXT } from '../../../sheet/sheet.constants';
import type { SpriteMode } from '../../../stores/sprite-store.type';
import type { HintedOption } from '../../HintedSegments';
import { MODE_HINTS } from '../ModeBar.constants';

const sheetReason = (previewing: boolean, total: number): string | false => {
  if (previewing) return SHEET_TEXT.modePreviewOff;
  return total < MIN_SHEET_SPRITES ? SHEET_TEXT.modeSheetOff : false;
};

const modeOptions = (previewing: boolean, total: number): HintedOption<SpriteMode>[] => [
  { value: 'sprite', label: SHEET_TEXT.sprite, hint: MODE_HINTS.sprite, disabled: previewing ? SHEET_TEXT.modePreviewOff : false },
  { value: 'sheet', label: SHEET_TEXT.sheet, hint: MODE_HINTS.sheet, disabled: sheetReason(previewing, total) },
  { value: 'tilemap', label: SHEET_TEXT.tilemap, hint: MODE_HINTS.tilemap, disabled: previewing ? SHEET_TEXT.modePreviewOff : false },
];

export { modeOptions };
