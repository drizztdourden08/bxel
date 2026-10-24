/* @layer renderer-app @kind logic */
import type { SliceOptions, SliceSpec } from './compose.type';

const sliceRequest = (spec: SliceSpec): SliceOptions => {
  const shared = { pattern: spec.pattern, start: spec.start, keep: spec.keep, skipEmpty: spec.skipEmpty };
  return spec.by === 'count'
    ? { ...shared, columns: spec.columns, rows: spec.rows }
    : { ...shared, cellWidth: spec.cellWidth, cellHeight: spec.cellHeight };
};

export { sliceRequest };
