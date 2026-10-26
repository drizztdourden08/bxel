/* @layer renderer-app @kind constants */
const COMPOSE_TEXT = {
  group: 'Animate',
  merge: 'Make an animation',
  strip: 'Cut strip into an animation',
  slice: 'Slice into a grid of sprites',
  mergeTitle: (count: number): string => (count === 1 ? 'Make an animation from the sprite' : `Make an animation from ${count} sprites`),
  stripTitle: 'Cut strip into an animation',
  sliceTitle: (count: number): string => (count === 1 ? 'Slice into a grid of sprites' : `Slice ${count} sprites into grids`),
  needOne: 'Pick at least one sprite.',
  needStrip: 'Pick one sprite that holds a strip of frames.',
  tooMany: (limit: number): string => `An animation takes at most ${limit} frames.`,
  mixedBanks: 'These sprites use different palettes. Give them one palette first.',
  padded: (width: number, height: number): string =>
    `The sprites differ in size. The animation canvas is ${width} by ${height} and each frame sits on its pivot.`,
  sameSize: (frames: number, width: number, height: number): string => `${frames} frames of ${width} by ${height}.`,
  name: 'Name of the new animation',
  nameHint: 'Leave it empty to use the name of the first sprite.',
  keep: 'Keep the original sprites',
  pattern: 'Names of the new sprites',
  patternHint: 'Use {name} for the old name, {n} for a number and {n:3} for a number with 3 digits.',
  start: 'First number',
  nothingInGrid: 'No cell holds a pixel, so no sprite would be made.',
  by: 'Cut by',
  byCount: 'Number of cells',
  bySize: 'Size of a cell',
  columns: 'Columns',
  rows: 'Rows',
  cellWidth: 'Cell width',
  cellHeight: 'Cell height',
  skipEmpty: 'Skip cells with no pixel',
  sliceCount: (cells: number, width: number, height: number): string => `${cells} cells of ${width} by ${height}.`,
  sliceEdge: (count: number): string => `${count} pixels at the edge fit no cell and are left out.`,
  previewNames: 'Names',
  more: (count: number): string => `and ${count} more`,
  nameProblem: 'A name is not valid or is already used.',
} as const;

const COMPOSE_LABEL = {
  merge: (count: number): string => (count === 1 ? 'Make an animation' : `Make an animation from ${count} sprites`),
  strip: 'Cut strip into an animation',
  slice: (count: number): string => (count === 1 ? 'Slice sprite into a grid' : `Slice ${count} sprites into grids`),
} as const;

export { COMPOSE_LABEL, COMPOSE_TEXT };
