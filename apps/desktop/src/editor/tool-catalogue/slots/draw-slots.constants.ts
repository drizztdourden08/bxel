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
    id: 'fill',
    group: 'draw',
    label: 'Fill',
    key: 'g',
    tool: 'fill',
    surfaces: PAINT_SURFACES,
    members: [{ id: 'fill', tool: 'fill', label: 'Fill', description: 'Fill an area with the front colour.', icon: 'pixel-fill-bucket' }],
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
