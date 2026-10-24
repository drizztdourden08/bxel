/* @layer core @kind logic */
import type { SheetCell } from './export-sheet.type';

const pageCells = (cells: readonly SheetCell[], groups: readonly number[]): SheetCell[] =>
  groups.flatMap((group, spriteIndex) =>
    cells.filter((cell) => cell.spriteIndex === group).map((cell) => ({ ...cell, spriteIndex })),
  );

export { pageCells };
