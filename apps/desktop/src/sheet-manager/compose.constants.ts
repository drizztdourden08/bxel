/* @layer renderer-app @kind constants */
import { DEFAULT_PIECE_PATTERN } from '@bxel/document';
import type { MergeSpec, SliceSpec, SplitSpec } from './compose.type';

const MERGE_START: MergeSpec = { name: '', anchor: 'center', keep: false };

const SPLIT_START: SplitSpec = { pattern: DEFAULT_PIECE_PATTERN, start: 1, keep: false };

const SLICE_START: SliceSpec = {
  by: 'count',
  columns: 2,
  rows: 2,
  cellWidth: 8,
  cellHeight: 8,
  pattern: DEFAULT_PIECE_PATTERN,
  start: 1,
  keep: false,
  skipEmpty: true,
};

const PREVIEW_NAMES = 6;

export { MERGE_START, PREVIEW_NAMES, SLICE_START, SPLIT_START };
