/* @layer core @kind logic */
import type { SheetCell } from './export-sheet.type';
import { occupiedBox } from './occupied-box';
import { rotateRgba } from './rotate-rgba';
import type { PackedItem, SheetPlacement } from './sheet.type';

const buildPlacements = (items: readonly PackedItem[], cells: readonly SheetCell[]): SheetPlacement[] =>
  items.flatMap((item, i) => {
    const cell = cells[i];
    if (!cell) return [];
    return [{ box: occupiedBox(item), image: item.rotated ? rotateRgba(cell.trimmed.image) : cell.trimmed.image }];
  });

export { buildPlacements };
