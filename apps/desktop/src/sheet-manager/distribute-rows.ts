/* @layer renderer-app @kind logic */
import type { Sheet, SpriteId } from '@bxel/document';
import { ALIGN_TEXT } from './align-text.constants';
import { alignBoxes } from './align-boxes';
import { animationBoxes } from './animation-boxes';
import type { AlignBox } from './align.type';
import { placeMoves } from './place-moves';
import { rowsPlan } from './rows-plan';

const boxesOf = (sheet: Sheet, ids: readonly SpriteId[], keys: readonly string[]): AlignBox<string>[] => {
  const everything = ids.length + keys.length === 0;
  const sprites = alignBoxes(sheet, everything ? sheet.entries.map((entry) => entry.spriteId) : ids);
  return [...sprites, ...animationBoxes(sheet, everything ? null : new Set(keys))];
};

const distributeRows = (sheet: Sheet | null, ids: readonly SpriteId[], keys: readonly string[]): boolean => {
  if (sheet?.layout.kind !== 'manual') return false;
  return placeMoves(sheet, rowsPlan(boxesOf(sheet, ids, keys), sheet.spacing.x), ALIGN_TEXT.rowsLabel);
};

export { distributeRows };
