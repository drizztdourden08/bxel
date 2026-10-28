/* @layer renderer-app @kind constants */
import { MAP_SURFACES } from '../surfaces.constants';
import type { ToolSlot } from '../tool-catalogue.type';

const MAP_SLOTS: readonly ToolSlot[] = [
  {
    id: 'map-place',
    group: 'draw',
    label: 'Place',
    key: 'b',
    tool: 'pencil',
    surfaces: MAP_SURFACES,
    members: [
      { id: 'map.place', tool: 'pencil', label: 'Place', description: 'Place the picked tile or tiles. Drag to paint a line of tiles.', icon: 'pixel-map-paint' },
    ],
  },
  {
    id: 'map-erase',
    group: 'draw',
    label: 'Erase',
    key: 'e',
    tool: 'eraser',
    surfaces: MAP_SURFACES,
    members: [{ id: 'map.erase', tool: 'eraser', label: 'Erase', description: 'Clear map cells. Drag to clear a line of cells.', icon: 'pixel-map-erase' }],
  },
  {
    id: 'map-fill',
    group: 'draw',
    label: 'Fill',
    key: 'g',
    tool: 'fill',
    surfaces: MAP_SURFACES,
    members: [
      { id: 'map.fill', tool: 'fill', label: 'Fill', description: 'Fill the connected area of equal cells with the picked tile.', icon: 'pixel-map-fill' },
    ],
  },
  {
    id: 'map-pick',
    group: 'draw',
    label: 'Pick',
    key: 'i',
    tool: 'picker',
    surfaces: MAP_SURFACES,
    members: [{ id: 'map.pick', tool: 'picker', label: 'Pick', description: 'Pick the tile and its turn from a map cell.', icon: 'pixel-map-pick' }],
  },
  {
    id: 'map-rect',
    group: 'shape',
    label: 'Rectangle',
    key: 'u',
    tool: 'shape',
    surfaces: MAP_SURFACES,
    members: [
      { id: 'map.rect', tool: 'shape', label: 'Rectangle', description: 'Drag a rectangle of the picked tile, filled or as an outline.', icon: 'pixel-map-rect' },
    ],
  },
  {
    id: 'map-select',
    group: 'select',
    label: 'Select',
    key: 'm',
    tool: 'select',
    surfaces: MAP_SURFACES,
    members: [
      {
        id: 'map.select',
        tool: 'select',
        label: 'Select',
        description: 'Select a rectangle of cells to replace a tile, turn, clear or make unique.',
        icon: 'pixel-select-rect',
      },
    ],
  },
];

export { MAP_SLOTS };
