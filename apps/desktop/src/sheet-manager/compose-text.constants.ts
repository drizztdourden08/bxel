/* @layer renderer-app @kind constants */
const COMPOSE_TEXT = {
  group: 'Combine',
  merge: 'Merge into one animation',
  split: 'Split frames into sprites',
  slice: 'Slice into a grid of sprites',
  mergeTitle: (count: number): string => `Merge ${count} sprites into one animation`,
  splitTitle: (count: number): string => (count === 1 ? 'Split frames into sprites' : `Split frames of ${count} sprites`),
  sliceTitle: (count: number): string => (count === 1 ? 'Slice into a grid of sprites' : `Slice ${count} sprites into grids`),
  needTwo: 'Pick at least two sprites to merge.',
  tooMany: (limit: number): string => `A merge takes at most ${limit} sprites.`,
  mixedBanks: 'These sprites use different palettes. Give them one palette first.',
  padded: (width: number, height: number): string =>
    `The sprites differ in size. Each one is padded to ${width} by ${height} and placed by the anchor.`,
  sameSize: (frames: number, width: number, height: number): string => `${frames} frames of ${width} by ${height}.`,
  name: 'Name of the new sprite',
  nameHint: 'Leave it empty to use the name of the first sprite.',
  anchor: 'Anchor for the smaller sprites',
  keep: 'Keep the original sprites',
  pattern: 'Names of the new sprites',
  patternHint: 'Use {name} for the old name, {n} for a number and {n:3} for a number with 3 digits.',
  start: 'First number',
  nothingInGrid: 'No cell holds a pixel, so no sprite would be made.',
  nothingToSplit: 'None of the picked sprites has more than one frame.',
  splitCount: (made: number, sources: number): string => (sources === 1 ? `${made} sprites from the frames.` : `${made} sprites from ${sources} animated sprites.`),
  splitSkipped: (count: number): string => (count === 1 ? '1 picked sprite has one frame and stays as it is.' : `${count} picked sprites have one frame and stay as they are.`),
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
  merge: (count: number): string => `Merge ${count} sprites into one animation`,
  split: (count: number): string => (count === 1 ? 'Split frames into sprites' : `Split frames of ${count} sprites`),
  slice: (count: number): string => (count === 1 ? 'Slice sprite into a grid' : `Slice ${count} sprites into grids`),
} as const;

export { COMPOSE_LABEL, COMPOSE_TEXT };
