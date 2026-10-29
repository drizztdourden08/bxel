/* @layer renderer-app @kind logic */
import { clearCells } from './clear-cells';
import { copyCells } from './copy-cells';

const cutCells = (): boolean => copyCells() && clearCells();

export { cutCells };
