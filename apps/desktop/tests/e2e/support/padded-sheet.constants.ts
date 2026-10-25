/* @layer renderer-app @kind constants */
import type { Cell } from './e2e.type';

const PADDED_SHEET = { cell: 6, offset: 2, spacing: 2, count: 3, width: 26, height: 10, file: 'padded-sheet.png' } as const;

const PADDED_COLOURS = [
  [214, 69, 80],
  [94, 194, 106],
  [58, 91, 160],
] as const;

const PADDED_MARKS: readonly (readonly Cell[])[] = [
  [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 2 }],
  [{ x: 5, y: 0 }, { x: 4, y: 1 }, { x: 3, y: 2 }, { x: 5, y: 1 }],
];

export { PADDED_COLOURS, PADDED_MARKS, PADDED_SHEET };
