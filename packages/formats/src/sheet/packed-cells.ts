/* @layer core @kind logic */
import type { SheetCell } from './export-sheet.type';

const packedCells = (cells: readonly SheetCell[]): SheetCell[] => cells.filter((cell) => cell.twin === undefined);

export { packedCells };
