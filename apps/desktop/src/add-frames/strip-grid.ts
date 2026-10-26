/* @layer renderer-app @kind logic */
import type { AnimStripGrid } from '@bxel/document';
import type { StripSpec } from './add-frames.type';

const stripGrid = (spec: StripSpec): AnimStripGrid =>
  spec.by === 'count' ? { columns: spec.columns, rows: spec.rows } : { cellWidth: spec.cellWidth, cellHeight: spec.cellHeight };

export { stripGrid };
