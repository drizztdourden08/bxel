/* @layer renderer-app @kind constants */
import type { FillMode, ShapeKind } from '@bxel/raster';
import type { SymmetryAxis } from '../stores/tool-store.type';
import type { PathTool } from './tool.type';

const SHAPE_LABELS: Readonly<Record<ShapeKind, string>> = {
  line: 'Line',
  rect: 'Rectangle',
  ellipse: 'Ellipse',
};

const PATH_LABELS: Readonly<Record<PathTool, string>> = {
  curve: 'Curve',
  polygon: 'Polygon',
  contour: 'Contour',
};

const FILL_MODES: readonly FillMode[] = ['contiguous', 'global'];

const FILL_LABELS: Readonly<Record<FillMode, string>> = {
  contiguous: 'Contiguous',
  global: 'Global',
};

const SYMMETRY_AXES: readonly SymmetryAxis[] = ['x', 'y'];

const SECONDARY_BUTTON = 2;

const PRIMARY_BUTTON = 0;

const PEN_ERASER_BUTTON = 5;

export { FILL_LABELS, FILL_MODES, PATH_LABELS, PEN_ERASER_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON, SHAPE_LABELS, SYMMETRY_AXES };
