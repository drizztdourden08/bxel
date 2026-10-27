/* @layer core @kind logic */
import type { Sheet } from '../model/sheet.type';
import { boxOverlaps } from './box-overlaps';
import { spriteBoxes } from './sheet-boxes';
import type { SheetOverlap, SheetSizes } from './sheet-overlap.type';

const findOverlaps = (sheet: Sheet, sizes: SheetSizes): SheetOverlap[] =>
  boxOverlaps(spriteBoxes(sheet, sizes)).flatMap(({ first, second }) =>
    first.kind === 'sprite' && second.kind === 'sprite' ? [{ first: first.spriteId, second: second.spriteId }] : [],
  );

export { findOverlaps };
