/* @layer renderer-app @kind logic */
import type { Sheet, SpriteId } from '@bxel/document';
import { ALIGN_TEXT } from './align-text.constants';
import { alignBoxes } from './align-boxes';
import { alignPlan } from './align-plan';
import type { AlignMode } from './align.type';
import { placeMoves } from './place-moves';

const alignSprites = (sheet: Sheet | null, ids: readonly SpriteId[], mode: AlignMode): boolean => {
  if (sheet?.layout.kind !== 'manual') return false;
  return placeMoves(sheet, alignPlan(alignBoxes(sheet, ids), mode), (count) => ALIGN_TEXT.label(mode, count));
};

export { alignSprites };
