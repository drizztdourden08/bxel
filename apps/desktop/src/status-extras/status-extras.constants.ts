/* @layer renderer-app @kind constants */
import type { StatusExtras } from './status-extras.type';

const EXTRA_TEXT = {
  index: 'Index',
  selection: 'Selection',
  drag: 'Moving by',
  frame: 'Frame',
  cell: 'Cell',
  tile: 'Under it',
  noTile: 'Empty',
  indexValue: (index: number, name: string): string => `${index} ${name}`,
  selectionValue: (width: number, height: number, x: number, y: number): string => `${width} x ${height} at ${x}, ${y}`,
  dragValue: (x: number, y: number): string => `${x >= 0 ? '+' : ''}${x}, ${y >= 0 ? '+' : ''}${y}`,
  frameValue: (at: number, total: number, ms: number): string => `${at}/${total}, ${ms} ms`,
  cellValue: (column: number, row: number): string => `${column}, ${row}`,
} as const;

const EMPTY_EXTRAS: StatusExtras = { index: null, selection: null, drag: null, frame: null, cell: null, tile: null };

export { EMPTY_EXTRAS, EXTRA_TEXT };
