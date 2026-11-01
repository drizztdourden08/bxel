/* @layer renderer-app @kind constants */
const ANIMATION_ENTRY_TEXT = {
  group: 'Animation',
  openInTimeline: 'Open in Timeline',
  copyForSheet: 'Make a copy for this sheet',
  placeFrames: 'Place frames as sprites',
  rowsPerTag: 'Rows per tag',
  needAnimation: 'Pick an animation on the sheet first.',
  needTags: 'The picked animations have no tags to split into rows.',
  needSheet: 'Open a sheet first.',
  copyLabel: (count: number): string => (count === 1 ? 'Copy animation for this sheet' : `Copy ${count} animations for this sheet`),
  rowsLabel: (count: number): string => (count === 1 ? 'Split animation into rows per tag' : `Split ${count} animations into rows per tag`),
  placed: (count: number): string => (count === 1 ? 'Placed 1 frame as a sprite.' : `Placed ${count} frames as sprites.`),
} as const;

const COPY_REF = 'sheetcopy';

export { ANIMATION_ENTRY_TEXT, COPY_REF };
