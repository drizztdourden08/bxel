/* @layer renderer-app @kind constants */
const SPRITE_LABEL = {
  rename: 'Rename sprite',
  duplicate: (count: number): string => (count === 1 ? 'Duplicate sprite' : `Duplicate ${count} sprites`),
  remove: (count: number): string => (count === 1 ? 'Delete sprite' : `Delete ${count} sprites`),
  reorder: 'Move sprite',
  place: (count: number): string => (count === 1 ? 'Move sprite on sheet' : `Move ${count} sprites on sheet`),
  arrange: { grid: 'Arrange sheet as grid', packed: 'Arrange sheet packed', manual: 'Arrange sheet by hand' },
  frame: (count: number): string => (count === 1 ? 'Duplicate frame' : `Duplicate frame on ${count} sprites`),
  slice: 'Add slice',
  removeSlices: 'Remove slices',
} as const;

const SPRITE_TEXT = {
  taken: (name: string): string => `Name ${name} is already used. Choose another name.`,
  confirmDelete: (count: number): string => (count === 1 ? 'Delete sprite? You can undo this.' : `Delete ${count} sprites? You can undo this.`),
  lastOne: 'A file keeps at least one sprite.',
} as const;

export { SPRITE_LABEL, SPRITE_TEXT };
