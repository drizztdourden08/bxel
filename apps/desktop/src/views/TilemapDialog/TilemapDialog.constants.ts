/* @layer renderer-app @kind constants */
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '@bxel/document';

const TILEMAP_DIALOG_TEXT = {
  tilesetTitle: 'New tileset',
  mapTitle: 'New tilemap',
  name: 'Name',
  tileSize: 'Tile size in pixels',
  width: 'Tile width',
  height: 'Tile height',
  mapSize: 'Map size in tiles',
  columns: 'Columns',
  rows: 'Rows',
  tileset: 'Tileset',
  create: 'Create',
  cancel: 'Cancel',
  tilesetNote: 'Every tile of a tileset has the same size and uses the palette of this file.',
  mapNote: 'A map starts with one empty layer. Add more layers in the Layers widget.',
  noTileset: 'Create a tileset first.',
  deleteTitle: 'Delete tile',
  deleteTile: 'Delete tile',
  deleteWarning: (key: number, uses: number): string =>
    `Tile ${key} is placed on ${uses} map ${uses === 1 ? 'cell' : 'cells'}. Choose what happens to ${uses === 1 ? 'it' : 'them'}.`,
  deleteAction: 'Cells that use this tile',
  clearCells: 'Clear the cells',
  replaceWith: (key: number): string => `Use tile ${key} instead`,
} as const;

const TILE_SIZE_RANGE = { min: MIN_SPRITE_SIZE, max: MAX_SPRITE_SIZE } as const;

const MAP_SIZE_RANGE = { min: 1, max: 1024 } as const;

const TILE_PRESETS: readonly number[] = [8, 16, 32, 64];

const TILESET_STEM = 'Tileset';

const MAP_STEM = 'Map';

const TILESET_DEFAULTS = { width: 16, height: 16 } as const;

const MAP_DEFAULTS = { columns: 32, rows: 24 } as const;

export { MAP_DEFAULTS, MAP_SIZE_RANGE, MAP_STEM, TILE_PRESETS, TILE_SIZE_RANGE, TILEMAP_DIALOG_TEXT, TILESET_DEFAULTS, TILESET_STEM };
