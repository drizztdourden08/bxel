/* @layer renderer-app @kind logic */
import { flagBitsOf, makeCell } from '@bxel/document';
import type { CellFlags } from '@bxel/document';

const bitsOfFlags = (flags: CellFlags): number => flagBitsOf(makeCell(1, flags));

export { bitsOfFlags };
