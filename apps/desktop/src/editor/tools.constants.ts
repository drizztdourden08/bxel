/* @layer renderer-app @kind constants */
import type { Connectivity, FillMode, ShapeKind } from '@bxel/raster';
import type { SymmetryAxis } from '../stores/tool-store.type';
import type { ToolDef, ToolGroup } from './tool.type';

const TOOLS: readonly ToolDef[] = [
  { id: 'pencil', label: 'Pencil', description: 'Draw pixels with the front colour. Hold Shift for a straight line.', key: 'b', group: 'draw' },
  { id: 'eraser', label: 'Eraser', description: 'Erase pixels to transparent. Hold Shift for a straight line.', key: 'e', group: 'draw' },
  { id: 'fill', label: 'Fill', description: 'Fill an area with the front colour.', key: 'g', group: 'draw' },
  { id: 'picker', label: 'Picker', description: 'Pick the colour under the pointer as the front colour.', key: 'i', group: 'draw' },
  { id: 'shape', label: 'Shapes', description: 'Draw a line, a rectangle or an ellipse.', key: 'u', group: 'draw' },
  { id: 'zoom', label: 'Zoom', description: 'Click to zoom in. Right click to zoom out.', key: 'z', group: 'view' },
  { id: 'hand', label: 'Hand', description: 'Drag to move the canvas around.', key: 'h', group: 'view' },
  {
    id: 'select',
    label: 'Select',
    description: 'Select pixels with a rectangle, an ellipse, a lasso, a wand or a colour.',
    key: 'm',
    group: 'select',
  },
  {
    id: 'move',
    label: 'Move',
    description: 'Move the selected pixels. The arrow keys nudge them by one pixel.',
    key: 'v',
    group: 'select',
  },
];

const TOOL_GROUPS: readonly ToolGroup[] = ['draw', 'select', 'view'];

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
