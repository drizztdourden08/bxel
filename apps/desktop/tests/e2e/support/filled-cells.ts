/* @layer renderer-app @kind logic */
import { MARKS_SIDE } from './marks.constants';

const filledCells = (grid: Uint8Array): string[] =>
  [...grid].flatMap((index, at) => (index === 0 ? [] : [`${at % MARKS_SIDE},${Math.floor(at / MARKS_SIDE)}`])).sort();

export { filledCells };
