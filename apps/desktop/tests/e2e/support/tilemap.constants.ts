/* @layer renderer-app @kind constants */
const TILEMAP_E2E = {
  label: 'Tilemap canvas',
  columns: 32,
  rows: 24,
  tile: 16,
  edited: 3,
  cells: [{ x: 14, y: 11 }, { x: 17, y: 12 }],
  stroke: [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }],
  file: 'map.bxmap',
} as const;

export { TILEMAP_E2E };
