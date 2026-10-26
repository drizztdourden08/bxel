/* @layer renderer-app @kind constants */
import { TILEMAP_COMMAND } from '../../keymap/tilemap-command-id.constants';
import type { HintSpec } from '../ActionHint';

const TILESET_TEXT = {
  region: 'Tileset',
  empty: 'Open a file to see its tiles.',
  noTileset: 'This file has no tileset yet.',
  noTiles: 'This tileset has no tiles yet. Add one, then draw it with Edit tile.',
  grid: 'Tiles',
  actions: 'Tile actions',
  newTileset: 'New tileset...',
  newTilemap: 'New tilemap...',
  newTilemapFromSet: 'New tilemap from this tileset',
  tile: (key: number, uses: number): string => `Tile ${key}, used ${uses} ${uses === 1 ? 'time' : 'times'}`,
  summary: (name: string, width: number, height: number, count: number): string =>
    `${name}: ${count} ${count === 1 ? 'tile' : 'tiles'} of ${width} x ${height} px`,
  picked: (key: number, uses: number): string => `Tile ${key} is placed ${uses} ${uses === 1 ? 'time' : 'times'}.`,
  pickedStamp: (columns: number, rows: number): string => `${columns} x ${rows} tiles picked as a stamp.`,
  editing: 'Editing',
} as const;

const TILE_MENU = {
  label: 'Tile actions',
  tile: '[data-tile-key]',
  edit: 'Edit tile',
  place: 'Place with this tile',
  remove: 'Delete tile...',
  needCells: 'Select some cells on the map first.',
} as const;

const TILE_COLUMNS = 5;

const THUMB_BOX = 40;

const ADD_HINT: HintSpec = {
  name: 'Add tile',
  description: 'Add an empty tile to the tileset and pick it. Draw it with Edit tile.',
  shortcuts: [{ command: TILEMAP_COMMAND.addTile }],
};

const DUPLICATE_HINT: HintSpec = {
  name: 'Duplicate tile',
  description: 'Add a copy of the picked tile as a new tile. Map cells keep the original.',
  shortcuts: [{ command: TILEMAP_COMMAND.duplicateTile }],
};

const UNIQUE_HINT: HintSpec = {
  name: 'Make unique',
  description: 'Give the selected map cells their own copy of their tile. Other cells keep the original.',
  shortcuts: [{ command: TILEMAP_COMMAND.makeUnique }],
};

const DELETE_HINT: HintSpec = {
  name: 'Delete tile',
  description: 'Remove the picked tile. A tile that is placed asks what happens to its cells.',
  shortcuts: [{ command: TILEMAP_COMMAND.deleteTile }],
};

const EDIT_HINT: HintSpec = {
  name: 'Edit tile pixels',
  description: 'Draw on the picked tile. Every cell that uses the tile changes with it.',
  shortcuts: [{ command: TILEMAP_COMMAND.toggleEdit }],
};

const NEW_TILESET_HINT: HintSpec = {
  name: 'New tileset',
  description: 'Start another set of tiles with its own tile size.',
  shortcuts: [{ command: TILEMAP_COMMAND.newTileset }],
};

const NEW_TILEMAP_HINT: HintSpec = {
  name: 'New tilemap',
  description: 'Start another map built from a tileset.',
  shortcuts: [{ command: TILEMAP_COMMAND.newTilemap }],
};

export { ADD_HINT, DELETE_HINT, DUPLICATE_HINT, EDIT_HINT, NEW_TILEMAP_HINT, NEW_TILESET_HINT, THUMB_BOX, TILE_COLUMNS, TILE_MENU, TILESET_TEXT, UNIQUE_HINT };
