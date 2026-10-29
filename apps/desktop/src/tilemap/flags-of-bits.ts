/* @layer renderer-app @kind logic */
import { cellOfBits, readCellFlags } from '@bxel/document';
import type { CellFlags } from '@bxel/document';

const flagsOfBits = (bits: number): CellFlags => readCellFlags(cellOfBits(1, bits));

export { flagsOfBits };
