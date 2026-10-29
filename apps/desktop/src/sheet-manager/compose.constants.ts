/* @layer renderer-app @kind constants */
import { DEFAULT_PIECE_PATTERN } from '@bxel/document';
import { DURATION_START, STRIP_START } from '../add-frames/add-frames.constants';
import type { AnimateSpec, CutStripSpec, SliceSpec } from './compose.type';

const ANIMATE_START: AnimateSpec = { name: '', mode: 'reference', durationMs: DURATION_START };

const CUT_STRIP_START: CutStripSpec = { name: '', strip: STRIP_START, result: 'cells', durationMs: DURATION_START, swap: false };

const SLICE_START: SliceSpec = {
  by: 'count',
  columns: 2,
  rows: 2,
  cellWidth: 8,
  cellHeight: 8,
  minSize: 2,
  merge: 0,
  pattern: DEFAULT_PIECE_PATTERN,
  start: 1,
  keep: false,
  existing: 'keep',
  skipEmpty: true,
};

const PREVIEW_NAMES = 6;

export { ANIMATE_START, CUT_STRIP_START, PREVIEW_NAMES, SLICE_START };
