/* @layer renderer-app @kind constants */
import { ALL_SURFACES } from '../surfaces.constants';
import type { ToolSlot } from '../tool-catalogue.type';

const VIEW_SLOTS: readonly ToolSlot[] = [
  {
    id: 'zoom',
    group: 'view',
    label: 'Zoom',
    key: 'z',
    tool: 'zoom',
    surfaces: ALL_SURFACES,
    members: [{ id: 'zoom', tool: 'zoom', label: 'Zoom', description: 'Click to zoom in. Right click to zoom out.', icon: 'pixel-zoom' }],
  },
  {
    id: 'hand',
    group: 'view',
    label: 'Hand',
    key: 'h',
    tool: 'hand',
    surfaces: ALL_SURFACES,
    members: [{ id: 'hand', tool: 'hand', label: 'Hand', description: 'Drag to move the canvas around.', icon: 'pixel-hand' }],
  },
];

export { VIEW_SLOTS };
