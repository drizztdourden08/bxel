/* @layer renderer-app @kind constants */
const SHEET_CANVAS_TEXT = {
  label: 'Sheet canvas',
  exportLabel: 'Sheet canvas, showing the export result',
  empty: 'No sprite is open.',
} as const;

const SHEET_MENU = {
  zone: 'canvas.sheet',
  label: 'Sheet actions',
  edit: 'Edit sprite',
  rename: 'Rename',
  duplicate: 'Duplicate',
  paintAll: 'Paint all selected',
  needTwo: 'Select at least two sprites.',
  slice: 'Slice',
  arrange: 'Arrange',
  order: 'Order',
  toStart: 'Move to start',
  toEnd: 'Move to end',
  selectAll: 'Select all sprites',
  zoomTo: 'Zoom to sprite',
  removeFromSheet: 'Remove from sheet',
  notOnSheet: 'The sprite is not on this sheet.',
  importImage: 'Import image...',
  sliceGrid: 'Slice grid...',
  export: 'Export...',
} as const;

const SHEET_TOKENS = {
  frame: '--c-text-muted',
  selected: '--c-danger',
  active: '--c-primary-bright',
  overlap: '--c-warning',
  slice: '--c-info',
  pivot: '--c-tertiary',
  label: '--c-text',
} as const;

const DOUBLE_CLICK_MS = 400;

const SELECT_DASH: readonly number[] = [4, 3];

const LABEL_MIN_ZOOM = 4;

const LABEL_SIZE = 10;

const LABEL_MIN_CELL = 28;

const LABEL_ELLIPSIS = '..';

const PIVOT_ARM = 3;

const OVERLAP_ALPHA = 0.35;

const OVERLAP_OUTLINE = 2;

const SNAP_REACH = 6;

export { DOUBLE_CLICK_MS, LABEL_ELLIPSIS, LABEL_MIN_CELL, LABEL_MIN_ZOOM, LABEL_SIZE, OVERLAP_ALPHA, OVERLAP_OUTLINE, PIVOT_ARM, SELECT_DASH, SHEET_CANVAS_TEXT, SHEET_MENU, SHEET_TOKENS, SNAP_REACH };
