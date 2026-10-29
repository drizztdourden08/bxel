/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Sheet } from '../model/sheet.type';
import { animationBoxes } from './animation-boxes';
import { boxOverlaps } from './box-overlaps';
import type { SheetPartOverlap, SheetSizes } from './sheet-overlap.type';
import { spriteBoxes } from './sprite-boxes';

const findPartOverlaps = (sheet: Sheet, sizes: SheetSizes, animations: readonly Animation[]): SheetPartOverlap[] =>
  boxOverlaps([...spriteBoxes(sheet, sizes), ...animationBoxes(sheet, animations)]);

export { findPartOverlaps };
