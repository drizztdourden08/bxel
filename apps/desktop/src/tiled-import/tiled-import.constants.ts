/* @layer renderer-app @kind constants */
const TILED_FILTERS = [{ name: 'Tiled map', extensions: ['tmj', 'tmx', 'json'] }];

const ATLAS_COLUMNS = 16;

const TILED_REF = { tileset: 'tiled-tileset', tilemap: 'tiled-tilemap' } as const;

const TILED_LABEL = 'Import Tiled map';

const LAYER_FALLBACK = 'Layer';

const ROOTED_PATH = /^([a-zA-Z]:)?\//;

const TILED_TEXT = {
  pickTitle: 'Import Tiled map',
  title: (file: string): string => `Import Tiled map: ${file}`,
  summary: (columns: number, rows: number, tiles: number, layers: number): string =>
    `Map ${columns} x ${rows} cells, ${tiles} tiles, ${layers} ${layers === 1 ? 'layer' : 'layers'}`,
  tileSize: (width: number, height: number): string => `Tile size ${width} x ${height} pixels`,
  name: 'Map name',
  readFailed: (file: string): string =>
    `Could not read ${file}. Keep the map, its tilesets and its images in the folder you pick, and allow Bxel to read that folder.`,
  imageFailed: (file: string): string => `Could not read the tileset image ${file}. Bxel imports PNG images.`,
  missingTileset: 'A tileset of this map has no data.',
  imported: (map: string, tiles: number): string => `Imported the Tiled map ${map} with ${tiles} tiles.`,
  importedTitle: 'Tiled import',
  warnings: 'Left out or changed',
  button: 'Import map',
  unavailable: 'File access is not available here.',
  orthogonalOnly: 'Only orthogonal Tiled maps can be imported.',
} as const;

export { ATLAS_COLUMNS, LAYER_FALLBACK, ROOTED_PATH, TILED_FILTERS, TILED_LABEL, TILED_REF, TILED_TEXT };
