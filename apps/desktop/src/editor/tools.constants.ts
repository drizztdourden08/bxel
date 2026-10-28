/* @layer renderer-app @kind constants */
import type { FillMode, ShapeKind } from '@bxel/raster';
import type { SymmetryAxis } from '../stores/tool-store.type';

const SHAPE_KINDS: readonly ShapeKind[] = ['line', 'rect', 'ellipse'];

const SHAPE_LABELS: Readonly<Record<ShapeKind, string>> = {
  line: 'Line',
  rect: 'Rectangle',
  ellipse: 'Ellipse',
};

const FILL_MODES: readonly FillMode[] = ['contiguous', 'global'];

const FILL_LABELS: Readonly<Record<FillMode, string>> = {
  contiguous: 'Contiguous',
  global: 'Global',
};

const SYMMETRY_AXES: readonly SymmetryAxis[] = ['x', 'y'];

const LINE_SLOPE = 2;

const SECONDARY_BUTTON = 2;

const PRIMARY_BUTTON = 0;

export { FILL_LABELS, FILL_MODES, LINE_SLOPE, PRIMARY_BUTTON, SECONDARY_BUTTON, SHAPE_KINDS, SHAPE_LABELS, SYMMETRY_AXES };
