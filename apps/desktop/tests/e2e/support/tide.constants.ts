/* @layer renderer-app @kind constants */
const TIDE = {
  project: 'Tide',
  animation: 'water',
  tileset: 'ground',
  map: 'sea',
  side: 8,
  columns: 4,
  rows: 3,
  frameMs: 200,
  indexes: [2, 3],
  label: 'Tilemap canvas',
} as const;

export { TIDE };
