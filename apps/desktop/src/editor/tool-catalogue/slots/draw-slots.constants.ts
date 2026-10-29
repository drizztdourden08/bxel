/* @layer renderer-app @kind constants */
import { PAINT_SURFACES } from '../surfaces.constants';
import type { ToolSlot } from '../tool-catalogue.type';

const DRAW_SLOTS: readonly ToolSlot[] = [
  {
    id: 'pencil',
    group: 'draw',
    label: 'Pencil',
    key: 'b',
    tool: 'pencil',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'pencil', tool: 'pencil', label: 'Pencil', description: 'Draw pixels with the front colour. Hold Shift for a straight line.', icon: 'pixel-pencil' },
    ],
  },
  {
    id: 'eraser',
    group: 'draw',
    label: 'Eraser',
    key: 'e',
    tool: 'eraser',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'eraser', tool: 'eraser', label: 'Eraser', description: 'Erase pixels to transparent. Hold Shift for a straight line.', icon: 'pixel-eraser' },
    ],
  },
  {
    id: 'spray',
    group: 'draw',
    label: 'Spray',
    key: 'Shift+B',
    tool: 'spray',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'spray', tool: 'spray', label: 'Spray', description: 'Spray random dots in a disc while the button is held. Hold still to build up density.', icon: 'pixel-brush-spray' },
    ],
  },
  {
    id: 'shade',
    group: 'draw',
    label: 'Shade',
    key: 's',
    tool: 'shade',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'shade', tool: 'shade', label: 'Shade', description: 'Move pixels along their ramp: the left button lightens, the right button darkens. Each pixel changes once per stroke.', icon: 'pixel-shade' },
    ],
  },
  {
    id: 'fill',
    group: 'draw',
    label: 'Fill',
    key: 'g',
    tool: 'fill',
    surfaces: PAINT_SURFACES,
    members: [{ id: 'fill', tool: 'fill', label: 'Fill', description: 'Fill an area with the front colour.', icon: 'pixel-fill-bucket' }],
  },
  {
    id: 'gradient',
    group: 'draw',
    label: 'Gradient',
    key: 'Shift+G',
    tool: 'gradient',
    surfaces: PAINT_SURFACES,
    members: [
      {
        id: 'gradient',
        tool: 'gradient',
        label: 'Gradient',
        description: 'Drag a line to fill the selection, or the whole cel, with a ramp. Hold Shift to snap the angle.',
        icon: 'pixel-gradient',
      },
    ],
  },
  {
    id: 'picker',
    group: 'draw',
    label: 'Picker',
    key: 'i',
    tool: 'picker',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'picker', tool: 'picker', label: 'Picker', description: 'Pick the colour under the pointer as the front colour.', icon: 'pixel-eyedropper' },
    ],
  },
];

export { DRAW_SLOTS };
