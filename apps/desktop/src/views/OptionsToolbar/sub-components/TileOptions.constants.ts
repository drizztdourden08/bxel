/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import { COLLISION_COMMAND } from '../../../keymap/collision-command-id.constants';
import { TERRAIN_COMMAND } from '../../../keymap/terrain-command-id.constants';
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { TILEMAP_COMMAND } from '../../../keymap/tilemap-command-id.constants';
import type { TileEditMode } from '../../../stores/tilemap-store.type';
import type { FlagOp } from '../../../tilemap/tilemap.type';
import type { HintSpec } from '../../ActionHint';
import type { FlagAction } from '../OptionsToolbar.type';

const TILE_OPTIONS_TEXT = {
  mode: 'Tile mode',
  modeDescription: 'Place tiles on the map or draw on the pixels of one tile.',
  place: 'Place Tile',
  edit: 'Edit Tile',
  filledCaption: 'Filled',
  collisionCaption: 'Collision',
  terrainCaption: 'Terrain',
  replaceInCaption: 'In selection',
  replaceAllCaption: 'Everywhere',
  uniqueCaption: 'Unique',
  clearCaption: 'Clear',
  replaceIn: 'Replace in selection',
  replaceAll: 'Replace everywhere',
  clear: 'Clear cells',
  unique: 'Make unique',
} as const;

const TILE_MODE_ORDER: readonly TileEditMode[] = ['place', 'edit'];

const TILE_MODE_ICONS: Readonly<Record<TileEditMode, IconName>> = { place: 'pixel-stamp', edit: 'pixel-pencil' };

const TILE_MODE_HINTS: Readonly<Record<TileEditMode, HintSpec>> = {
  place: {
    name: TILE_OPTIONS_TEXT.place,
    description: 'Pick tiles and place them on the map. The pixels of a tile are never changed.',
    shortcuts: [{ command: TILEMAP_COMMAND.placeTiles }, { command: TILEMAP_COMMAND.toggleEdit, label: 'Switch' }],
  },
  edit: {
    name: TILE_OPTIONS_TEXT.edit,
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

const FLAG_HINTS: Readonly<Record<FlagOp, HintSpec>> = { flipX: FLIP_X_HINT, flipY: FLIP_Y_HINT, turn: TURN_HINT };

const FLAG_ACTIONS: readonly FlagAction[] = [
  { op: 'flipX', flag: 'flipX', icon: 'pixel-flip-tile-x', hint: FLIP_X_HINT },
  { op: 'flipY', flag: 'flipY', icon: 'pixel-flip-tile-y', hint: FLIP_Y_HINT },
  { op: 'turn', flag: 'diagonal', icon: 'pixel-turn-right', hint: TURN_HINT },
];

const COLLISION_OVERLAY_HINT: HintSpec = {
  name: 'Show collision',
  description: 'Draw the collision shape of every placed tile over the map.',
  shortcuts: [{ command: COLLISION_COMMAND.toggleOverlay }],
};

const TERRAIN_BRUSH_HINT: HintSpec = {
  name: 'Terrain brush',
  description: 'Paint and erase with the terrain rules of the tileset, so the tiles join their neighbours.',
  shortcuts: [{ command: TERRAIN_COMMAND.toggleBrush }],
};

const FILLED_MAP_HINT: HintSpec = {
  name: 'Filled',
  description: 'Fill the inside of the rectangle. Off draws only the outline.',
};

const REPLACE_IN_HINT: HintSpec = {
  name: TILE_OPTIONS_TEXT.replaceIn,
  description: 'Swap the tile in the first selected cell for the picked tile, inside the selection only.',
  shortcuts: [{ command: TILEMAP_COMMAND.replaceSelection }],
};

const REPLACE_ALL_HINT: HintSpec = {
  name: TILE_OPTIONS_TEXT.replaceAll,
  description: 'Swap the tile in the first selected cell for the picked tile on the whole layer.',
  shortcuts: [{ command: TILEMAP_COMMAND.replaceEverywhere }],
};

const CLEAR_CELLS_HINT: HintSpec = {
  name: TILE_OPTIONS_TEXT.clear,
  description: 'Empty the selected cells. The tiles stay in the tileset.',
  shortcuts: [{ command: TILEMAP_COMMAND.clearCells }],
};

const UNIQUE_CELLS_HINT: HintSpec = {
  name: TILE_OPTIONS_TEXT.unique,
  description: 'Give the selected cells their own copy of their tile, so editing it leaves other cells alone.',
  shortcuts: [{ command: TILEMAP_COMMAND.makeUnique }],
};

export {
  CLEAR_CELLS_HINT, COLLISION_OVERLAY_HINT, FILLED_MAP_HINT, TERRAIN_BRUSH_HINT, FLAG_ACTIONS, FLAG_HINTS, REPLACE_ALL_HINT, REPLACE_IN_HINT, TILE_MODE_HINTS, TILE_MODE_ICONS, TILE_MODE_ORDER,
  TILE_OPTIONS_TEXT, UNIQUE_CELLS_HINT,
};
