/* @layer renderer-app @kind constants */
import type { SheetLayout } from '@bxel/document';

const plural = (count: number, one: string, many: string): string => `${count} ${count === 1 ? one : many}`;

const SHEET_TEXT = {
  entries: (count: number): string => plural(count, 'entry', 'entries'),
  picked: (count: number): string => (count > 0 ? `, ${count} selected` : ''),
  shownOf: (shown: number, total: number): string => (shown === total ? plural(total, 'entry', 'entries') : `${shown} of ${plural(total, 'entry', 'entries')}`),
  layout: (layout: SheetLayout): string => {
    if (layout.kind === 'grid') return `Grid, ${plural(layout.columns, 'column', 'columns')}`;
    return layout.kind === 'packed' ? 'Packed' : 'By hand';
  },
  layoutOpen: 'Open the layout settings',
  overlaps: (count: number): string => plural(count, 'overlap', 'overlaps'),
  overlapsHint: 'Some entries cover each other on the sheet. Press to spread them out in rows.',
  titleLabel: 'Sheet',
  widgetTitle: (name: string, count: number): string => `Sheet: ${name} (${count})`,
  add: 'Add',
  addMenu: 'Add to the sheet',
  addFromProject: 'Add from project',
  newSprite: 'New sprite',
  importImage: 'Import image',
  sliceImage: 'Slice an image',
  needSprite: 'Pick a sprite first.',
  overflow: 'View options',
  view: 'View',
  thumbnailSize: 'Thumbnail size',
  sizeLabel: (px: number): string => `${px} pixels`,
  sort: 'Sort',
  collapseAll: 'Collapse all folders',
  expandAll: 'Expand all folders',
  reverse: 'Reverse the order',
  search: 'Search the sheet',
  searchHint: 'Name or a pattern such as walk_*',
  filter: 'Filter',
  clear: 'Clear',
  clearChips: 'Clear the search and the filters',
  removeChip: (label: string): string => `Remove filter ${label}`,
  chips: {
    sprites: 'Sprites',
    animations: 'Animations',
    slices: 'Has slices',
    identical: 'Identical',
    size: (key: string): string => `Size ${key}`,
    tag: (name: string): string => `Tag ${name}`,
    bank: (name: string): string => `Palette ${name}`,
  },
  lock: {
    readOnly: 'This file is open read only. You can look and export, but not change the sheet.',
    assistant: (line: string): string => `The assistant is working on this file (${line}). Edits wait until it is done.`,
  },
  empty: {
    noSheet: 'Open a sheet to see its sprites.',
    noSheetBody: 'This panel lists the sprites and animations of the sheet in the open tab.',
    sheet: 'This sheet is empty.',
    sheetBody: 'Drag sprites or animations here from the Project panel, or add them from the Library.',
    noMatch: 'No entry matches.',
    clearSearch: 'Clear search',
    libraryAll: 'Every sprite of the project is on this sheet.',
    libraryNone: 'No sprites in this project yet.',
    libraryMatch: 'Nothing in the library matches.',
  },
  library: {
    title: 'Library',
    label: (count: number): string => (count === 0 ? 'Library' : `Library (${count})`),
    search: 'Search the library',
    add: (count: number): string => (count === 1 ? 'Add 1 to sheet' : `Add ${count} to sheet`),
    addNone: 'Add to sheet',
    hint: 'Drag here from the sheet to take entries off it. The files are kept.',
    drop: 'Drop to remove from the sheet. The files are kept.',
    open: 'Open',
    reveal: 'Show in Project panel',
  },
  live: {
    removed: (count: number): string => plural(count, 'entry removed from the sheet', 'entries removed from the sheet'),
    added: (count: number): string => plural(count, 'entry added to the sheet', 'entries added to the sheet'),
  },
} as const;

const BATCH_TEXT = {
  bar: 'Actions for the picked entries',
  count: (count: number): string => `${count} picked`,
  pivot: 'Pivot',
  size: 'Size',
  trim: 'Trim',
  flip: 'Flip',
  turn: 'Turn',
  palette: 'Palette',
  rename: 'Rename',
  folder: 'Folder',
  remove: 'Remove from sheet',
  more: 'More',
  overflow: 'Fewer actions',
  spritesOnly: 'Only sprites can be changed this way.',
} as const;

export { BATCH_TEXT, SHEET_TEXT };
