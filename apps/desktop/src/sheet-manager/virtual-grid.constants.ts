/* @layer renderer-app @kind constants */
const SPACER_SIZES: readonly number[] = [256, 64, 16, 4, 1];

const GRID_ROW_ATTRIBUTE = 'data-grid-row';

const GRID_GAP = 4;

const ROW_BUCKETS: readonly { readonly upTo: number; readonly token: number }[] = [
  { upTo: 32, token: 80 },
  { upTo: 56, token: 96 },
  { upTo: 72, token: 128 },
  { upTo: 104, token: 160 },
  { upTo: Number.POSITIVE_INFINITY, token: 192 },
];

export { GRID_GAP, GRID_ROW_ATTRIBUTE, ROW_BUCKETS, SPACER_SIZES };
