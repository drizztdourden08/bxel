/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { ANIMATION_COMMAND } from '../keymap/animation-command-id.constants';
import { COLLISION_COMMAND } from '../keymap/collision-command-id.constants';
import { TERRAIN_COMMAND } from '../keymap/terrain-command-id.constants';
import { TILEMAP_COMMAND as ID } from '../keymap/tilemap-command-id.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const modeEntries = (state: EditorMenuState): MenuEntry[] => [
  menuItem(ID.placeTiles, 'Place Tile', { checked: state.surface === 'map' }),
  menuItem(ID.editTile, 'Edit Tile', { checked: state.surface === 'tile' }),
  'separator',
  menuItem(ID.newTileset, 'New tileset...'),
  menuItem(ID.newTilemap, 'New tilemap...'),
  menuItem(ID.addTile, 'Add tile'),
  menuItem(ID.duplicateTile, 'Duplicate tile'),
  menuItem(ID.deleteTile, 'Delete tile...'),
];

const cellEntries = (state: EditorMenuState): MenuEntry[] => [
  'separator',
  menuItem(ID.flipX, 'Flip placed tile X'),
  menuItem(ID.flipY, 'Flip placed tile Y'),
  menuItem(ID.turn, 'Rotate placed tile 90'),
  'separator',
  menuItem(ID.makeUnique, 'Make selected cells unique'),
  menuItem(ID.replaceSelection, 'Replace tile in selection'),
  menuItem(ID.replaceEverywhere, 'Replace tile on the layer'),
  menuItem(ID.clearCells, 'Clear selected cells'),
  'separator',
  menuItem(ID.layerUp, 'Move map layer up'),
  menuItem(ID.layerDown, 'Move map layer down'),
  'separator',
  menuItem(COLLISION_COMMAND.toggleOverlay, 'Show collision', { checked: state.collision }),
  menuItem(TERRAIN_COMMAND.toggleBrush, 'Terrain brush', { checked: state.terrainBrush }),
  menuItem(ANIMATION_COMMAND.toggleTiles, 'Animate tiles', { checked: state.animateTiles }),
];

const tilemapItems = (state: EditorMenuState): MenuEntry[] => [...modeEntries(state), ...(state.surface === 'map' ? cellEntries(state) : [])];

export { tilemapItems };
