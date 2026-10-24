/* @layer renderer-app @kind constants */
import type { Cell } from './e2e.type';

const MARKS: readonly (readonly [number, readonly Cell[]])[] = [
  [3, [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }]],
  [5, [{ x: 9, y: 2 }, { x: 10, y: 2 }, { x: 10, y: 3 }]],
  [9, [{ x: 6, y: 10 }, { x: 7, y: 11 }, { x: 8, y: 12 }]],
];

const MARKS_SIDE = 16;

export { MARKS, MARKS_SIDE };
