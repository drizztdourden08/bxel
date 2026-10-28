/* @layer renderer-app @kind constants */
const EXTRA_TEXT = {
  index: 'Index',
  selection: 'Selection',
  drag: 'Moving by',
  frame: 'Frame',
  cell: 'Cell',
  tile: 'Tile',
  noTile: 'Empty',
  indexValue: (index: number, name: string): string => `${index} ${name}`,
  selectionValue: (width: number, height: number, x: number, y: number): string => `${width} x ${height} at ${x}, ${y}`,
  dragValue: (x: number, y: number): string => `${x >= 0 ? '+' : ''}${x}, ${y >= 0 ? '+' : ''}${y}`,
  frameValue: (at: number, total: number, ms: number): string => `${at}/${total}, ${ms} ms`,
  cellValue: (column: number, row: number): string => `${column}, ${row}`,
} as const;

export { EXTRA_TEXT };
