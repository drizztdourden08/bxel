/* @layer renderer-app @kind constants */
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { TILEMAP_COMMAND } from '../../../keymap/tilemap-command-id.constants';
import type { TileEditMode } from '../../../stores/tilemap-store.type';
import type { HintSpec } from '../../ActionHint';
import type { FlagAction } from '../ContextBar.type';

const TILE_BAR_TEXT = {
  mode: 'Tile mode',
  place: 'Place Tile',
  edit: 'Edit Tile',
  placing: 'Placing tiles: the pixels of a tile stay as they are',
  editing: (key: number, uses: number): string =>
    `Editing tile ${key}: ${uses} ${uses === 1 ? 'placement changes' : 'placements change'} with it`,
  editingNone: 'Pick a tile to edit',
  map: (name: string): string => `Map: ${name}`,
  layer: (name: string, state: string): string => (state === '' ? `Layer: ${name}` : `Layer: ${name} (${state})`),
  locked: 'locked',
  hidden: 'hidden',
  turn: 'Turn',
  noTurn: 'None',
  flags: 'Tile turn',
  filled: 'Filled',
  selection: 'Selection',
  replaceIn: 'Replace in selection',
  replaceAll: 'Replace everywhere',
  clear: 'Clear cells',
  unique: 'Make unique',
  selected: (columns: number, rows: number): string => `${columns} x ${rows} cells selected`,
  noSelection: 'Drag to select cells',
} as const;

const TILE_MODE_HINTS: Readonly<Record<TileEditMode, HintSpec>> = {
  place: {
    name: TILE_BAR_TEXT.place,
    description: 'Pick tiles and place them on the map. The pixels of a tile are never changed.',
    shortcuts: [{ command: TILEMAP_COMMAND.placeTiles }, { command: TILEMAP_COMMAND.toggleEdit, label: 'Switch' }],
  },
  edit: {
    name: TILE_BAR_TEXT.edit,
    description: 'Draw on the pixels of one tile. Every map cell that uses the tile changes with it.',
    shortcuts: [{ command: TILEMAP_COMMAND.editTile }, { command: TILEMAP_COMMAND.toggleEdit, label: 'Switch' }],
  },
};

const FLIP_X_HINT: HintSpec = {
  name: 'Flip X',
  description: 'Mirror the tile left to right. With a selection it turns the selected cells, else the tile you place.',
  shortcuts: [{ command: SELECTION_COMMAND_ID.flipHorizontal }],
};

const FLIP_Y_HINT: HintSpec = {
  name: 'Flip Y',
  description: 'Mirror the tile top to bottom. With a selection it turns the selected cells, else the tile you place.',
  shortcuts: [{ command: SELECTION_COMMAND_ID.flipVertical }],
};

const TURN_HINT: HintSpec = {
  name: 'Rotate 90',
  description: 'Rotate the tile a quarter turn clockwise. It needs square tiles.',
  shortcuts: [{ command: SELECTION_COMMAND_ID.turnClockwise }],
};

const FLAG_ACTIONS: readonly FlagAction[] = [
  { op: 'flipX', flag: 'flipX', icon: 'flipTileX', hint: FLIP_X_HINT },
  { op: 'flipY', flag: 'flipY', icon: 'flipTileY', hint: FLIP_Y_HINT },
  { op: 'turn', flag: 'diagonal', icon: 'turnRight', hint: TURN_HINT },
];

const FILLED_MAP_HINT: HintSpec = {
  name: 'Filled',
  description: 'Fill the inside of the rectangle. Off draws only the outline.',
};

const REPLACE_IN_HINT: HintSpec = {
  name: TILE_BAR_TEXT.replaceIn,
  description: 'Swap the tile in the first selected cell for the picked tile, inside the selection only.',
  shortcuts: [{ command: TILEMAP_COMMAND.replaceSelection }],
};

const REPLACE_ALL_HINT: HintSpec = {
  name: TILE_BAR_TEXT.replaceAll,
  description: 'Swap the tile in the first selected cell for the picked tile on the whole layer.',
  shortcuts: [{ command: TILEMAP_COMMAND.replaceEverywhere }],
};

const CLEAR_CELLS_HINT: HintSpec = {
  name: TILE_BAR_TEXT.clear,
  description: 'Empty the selected cells. The tiles stay in the tileset.',
  shortcuts: [{ command: TILEMAP_COMMAND.clearCells }],
};

const UNIQUE_CELLS_HINT: HintSpec = {
  name: TILE_BAR_TEXT.unique,
  description: 'Give the selected cells their own copy of their tile, so editing it leaves other cells alone.',
  shortcuts: [{ command: TILEMAP_COMMAND.makeUnique }],
};

export {
  CLEAR_CELLS_HINT, FILLED_MAP_HINT, FLAG_ACTIONS, REPLACE_ALL_HINT, REPLACE_IN_HINT, TILE_BAR_TEXT, TILE_MODE_HINTS,
  UNIQUE_CELLS_HINT,
};
