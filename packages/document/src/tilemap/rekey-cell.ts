/* @layer core @kind logic */
import { CELL } from './cell.constants';

const rekeyCell = (cell: number, key: number): number => (key === 0 ? 0 : ((cell & CELL.FLAG_MASK) | key) >>> 0);

export { rekeyCell };
