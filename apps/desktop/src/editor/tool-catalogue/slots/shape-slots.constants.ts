/* @layer renderer-app @kind constants */
import { PAINT_SURFACES } from '../surfaces.constants';
import type { ToolSlot } from '../tool-catalogue.type';

const SHAPE_SLOTS: readonly ToolSlot[] = [
  {
    id: 'line',
    group: 'shape',
    label: 'Line',
    key: 'l',
    tool: 'line',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'line', tool: 'line', label: 'Line', description: 'Draw a straight line. Shift snaps to clean ratios, Alt draws from the centre, Space moves it.', icon: 'pixel-shape-line' },
    ],
  },
  {
    id: 'curve',
    group: 'shape',
    label: 'Curve',
    key: 'Shift+L',
    tool: 'curve',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'curve', tool: 'curve', label: 'Curve', description: 'Drag the ends, release, then move to bend the curve and click to finish. Enter finishes, Escape cancels.', icon: 'pixel-shape-curve' },
    ],
  },
  {
    id: 'rect',
    group: 'shape',
    label: 'Rectangle',
    key: 'u',
    tool: 'rect',
    surfaces: PAINT_SURFACES,
    members: [
      {
        id: 'rect',
        tool: 'rect',
        label: 'Rectangle',
        description: 'Draw a rectangle. Shift keeps it square, Alt draws from the centre, Space moves it. Press the key again to toggle filled.',
        icon: 'pixel-shape-rect',
        filledIcon: 'pixel-shape-rect-filled',
      },
    ],
  },
  {
    id: 'ellipse',
    group: 'shape',
    label: 'Ellipse',
    key: 'Shift+U',
    tool: 'ellipse',
    surfaces: PAINT_SURFACES,
    members: [
      {
        id: 'ellipse',
        tool: 'ellipse',
        label: 'Ellipse',
        description: 'Draw an ellipse. Shift keeps it round, Alt draws from the centre, Space moves it. Press the key again to toggle filled.',
        icon: 'pixel-shape-ellipse',
        filledIcon: 'pixel-shape-ellipse-filled',
      },
    ],
  },
  {
    id: 'contour',
    group: 'shape',
    label: 'Contour',
    key: 'd',
    tool: 'contour',
    surfaces: PAINT_SURFACES,
    members: [{ id: 'contour', tool: 'contour', label: 'Contour', description: 'Draw a free outline. It closes and fills when you release.', icon: 'pixel-select-lasso' }],
  },
  {
    id: 'polygon',
    group: 'shape',
    label: 'Polygon',
    key: 'Shift+D',
    tool: 'polygon',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'polygon', tool: 'polygon', label: 'Polygon', description: 'Click each corner. Enter or a double click closes it, Backspace removes the last corner, Escape cancels.', icon: 'pixel-shape-polygon' },
    ],
  },
];

export { SHAPE_SLOTS };
