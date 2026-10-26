/* @layer renderer-app @kind constants */
const GALLERY = {
  project: 'Gallery',
  palette: 'Main',
  sprites: ['hero', 'slime'],
  sheet: 'walk',
  tileset: 'Ground',
  map: 'Level',
  side: 16,
  tile: 8,
  columns: 8,
  rows: 5,
  frameMs: 200,
  ring: 2,
  eyeTone: 11,
  eyes: { left: 5, right: 10, row: 6 },
  tones: { skin: 7, slime: 4, grass: 6, stone: 13 },
} as const;

export { GALLERY };
