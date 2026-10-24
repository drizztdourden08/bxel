/* @layer renderer-app @kind constants */
import type { ToolDef } from '../editor/tool.type';

const MAP_TOOLS: readonly ToolDef[] = [
  { id: 'pencil', label: 'Place', description: 'Place the picked tile or tiles. Drag to paint a line of tiles.', key: 'b', group: 'draw' },
  { id: 'eraser', label: 'Erase', description: 'Clear map cells. Drag to clear a line of cells.', key: 'e', group: 'draw' },
  { id: 'fill', label: 'Fill', description: 'Fill the connected area of equal cells with the picked tile.', key: 'g', group: 'draw' },
  { id: 'picker', label: 'Pick', description: 'Pick the tile and its turn from a map cell.', key: 'i', group: 'draw' },
  { id: 'shape', label: 'Rectangle', description: 'Drag a rectangle of the picked tile, filled or as an outline.', key: 'u', group: 'draw' },
  {
    id: 'select',
    label: 'Select',
    description: 'Select a rectangle of cells to replace a tile, turn, clear or make unique.',
    key: 'm',
    group: 'select',
  },
  { id: 'zoom', label: 'Zoom', description: 'Click to zoom in. Right click to zoom out.', key: 'z', group: 'view' },
  { id: 'hand', label: 'Hand', description: 'Drag to move the map around.', key: 'h', group: 'view' },
];

export { MAP_TOOLS };
