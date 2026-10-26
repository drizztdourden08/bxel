/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Sheet } from '../model/sheet.type';
import { boxOverlaps } from './box-overlaps';
import { animationBoxes, spriteBoxes } from './sheet-boxes';
import type { SheetPartOverlap, SheetSizes } from './sheet-overlap.type';

const findPartOverlaps = (sheet: Sheet, sizes: SheetSizes, animations: readonly Animation[]): SheetPartOverlap[] =>
  boxOverlaps([...spriteBoxes(sheet, sizes), ...animationBoxes(sheet, animations)]);

export { findPartOverlaps };
