/* @layer renderer-app @kind constants */
import type { Connectivity, FillMode, ShapeKind } from '@bxel/raster';
import type { SymmetryAxis } from '../stores/tool-store.type';
import type { ToolDef, ToolGroup } from './tool.type';

const TOOLS: readonly ToolDef[] = [
  { id: 'pencil', label: 'Pencil', key: 'b', group: 'draw' },
  { id: 'eraser', label: 'Eraser', key: 'e', group: 'draw' },
  { id: 'fill', label: 'Fill', key: 'g', group: 'draw' },
  { id: 'picker', label: 'Picker', key: 'i', group: 'draw' },
  { id: 'shape', label: 'Shapes', key: 'u', group: 'draw' },
  { id: 'zoom', label: 'Zoom', key: 'z', group: 'view' },
  { id: 'hand', label: 'Hand', key: 'h', group: 'view' },
];

const TOOL_GROUPS: readonly ToolGroup[] = ['draw', 'view'];

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

const CONNECTIVITIES: readonly Connectivity[] = [4, 8];

const SYMMETRY_AXES: readonly SymmetryAxis[] = ['x', 'y'];

const LINE_SLOPE = 2;

const SECONDARY_BUTTON = 2;

const PRIMARY_BUTTON = 0;

export { CONNECTIVITIES, FILL_LABELS, FILL_MODES, LINE_SLOPE, PRIMARY_BUTTON, SECONDARY_BUTTON, SHAPE_KINDS, SHAPE_LABELS, SYMMETRY_AXES, TOOL_GROUPS, TOOLS };
