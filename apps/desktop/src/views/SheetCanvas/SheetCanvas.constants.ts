/* @layer renderer-app @kind constants */
const SHEET_CANVAS_TEXT = {
  label: 'Sheet canvas',
  empty: 'No sprite is open.',
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

const PIVOT_ARM = 3;

const OVERLAP_ALPHA = 0.35;

export { DOUBLE_CLICK_MS, LABEL_MIN_ZOOM, LABEL_SIZE, OVERLAP_ALPHA, PIVOT_ARM, SELECT_DASH, SHEET_CANVAS_TEXT, SHEET_TOKENS };
