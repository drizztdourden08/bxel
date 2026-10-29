/* @layer renderer-app @kind logic */
import { CELL_PAD, MIN_CELL } from './track-layout.constants';

const cellWidth = (thumb: number): number => Math.max(thumb + CELL_PAD * 2, MIN_CELL);

export { cellWidth };
