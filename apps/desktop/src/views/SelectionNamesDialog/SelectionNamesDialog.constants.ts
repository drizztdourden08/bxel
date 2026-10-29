/* @layer renderer-app @kind constants */
import type { CombineMode } from '@bxel/raster';

const SELECTION_NAMES_TEXT = {
  title: 'Saved selections',
  close: 'Close',
  nameLabel: 'Name',
  namePlaceholder: 'Name this selection',
  save: 'Save selection',
  needsSelection: 'Select some pixels first, then save them under a name.',
  empty: 'No saved selections yet. They are kept in the file and the assistant can see them.',
  list: 'Saved selections',
  size: (width: number, height: number): string => `${width} by ${height}`,
  stale: 'Made for another canvas size',
  remove: 'Delete',
  loadAs: (mode: string, name: string): string => `${mode} ${name}`,
} as const;

const LOAD_MODES: readonly CombineMode[] = ['replace', 'add', 'subtract', 'intersect'];

export { LOAD_MODES, SELECTION_NAMES_TEXT };
