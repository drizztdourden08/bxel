/* @layer renderer-app @kind logic */
import type { Sheet, SpriteId } from '@bxel/document';
import { ALIGN_TEXT } from './align-text.constants';
import { alignBoxes } from './align-boxes';
import { placeMoves } from './place-moves';
import { rowsPlan } from './rows-plan';

const distributeRows = (sheet: Sheet | null, ids: readonly SpriteId[]): boolean => {
  if (sheet?.layout.kind !== 'manual') return false;
  return placeMoves(sheet, rowsPlan(alignBoxes(sheet, ids), sheet.spacing.x), ALIGN_TEXT.rowsLabel);
};

export { distributeRows };
