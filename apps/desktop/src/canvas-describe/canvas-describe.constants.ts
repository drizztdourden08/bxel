/* @layer renderer-app @kind constants */
const DESCRIBE_TEXT = {
  nothing: 'No sprite is open.',
  size: (width: number, height: number): string => `Canvas ${width} by ${height} pixels`,
  frame: (frame: number, count: number): string => `frame ${frame} of ${count}`,
  layer: (name: string): string => `layer ${name}`,
  colours: (count: number): string => (count === 1 ? 'one colour used' : `${count} colours used`),
  noSelection: 'no selection',
  selection: (width: number, height: number, x: number, y: number): string => `selection ${width} by ${height} at ${x}, ${y}`,
  zoom: (percent: number): string => `zoom ${percent} percent`,
  mirrored: 'view mirrored',
  noRow: 'Move the pointer or the keyboard cursor onto the canvas first.',
  row: (y: number, runs: string): string => `Row ${y}: ${runs}`,
} as const;

const ROW_RUN_MAX = 24;

export { DESCRIBE_TEXT, ROW_RUN_MAX };
