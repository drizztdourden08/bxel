/* @layer renderer-app @kind logic */
import type { SegmentOption } from '@drizztdourden08/tessera';
import { MIN_SHEET_SPRITES, SHEET_TEXT } from '../../../sheet/sheet.constants';
import type { SpriteMode } from '../../../stores/sprite-store.type';

const sheetReason = (previewing: boolean, total: number): string | false => {
  if (previewing) return SHEET_TEXT.modePreviewOff;
  return total < MIN_SHEET_SPRITES ? SHEET_TEXT.modeSheetOff : false;
};

const modeOptions = (previewing: boolean, total: number): SegmentOption<SpriteMode>[] => [
  { value: 'sprite', label: SHEET_TEXT.sprite, disabled: previewing ? SHEET_TEXT.modePreviewOff : false },
  { value: 'sheet', label: SHEET_TEXT.sheet, disabled: sheetReason(previewing, total) },
];

export { modeOptions };
