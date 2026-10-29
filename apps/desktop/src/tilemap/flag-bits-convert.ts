/* @layer renderer-app @kind logic */
import { cellOfBits, flagBitsOf, makeCell, readCellFlags } from '@bxel/document';
import type { CellFlags } from '@bxel/document';

const bitsOfFlags = (flags: CellFlags): number => flagBitsOf(makeCell(1, flags));

const flagsOfBits = (bits: number): CellFlags => readCellFlags(cellOfBits(1, bits));

export { bitsOfFlags, flagsOfBits };
