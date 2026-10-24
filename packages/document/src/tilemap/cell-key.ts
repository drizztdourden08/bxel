/* @layer core @kind logic */
import { CELL } from './cell.constants';

const cellKey = (cell: number): number => cell & CELL.KEY_MASK;

export { cellKey };
