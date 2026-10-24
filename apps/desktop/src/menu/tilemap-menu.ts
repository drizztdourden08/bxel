/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { SHEET_COMMAND } from '../keymap/sheet-command-id.constants';
import { TILEMAP_COMMAND as ID } from '../keymap/tilemap-command-id.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const tilemapMenu = (state: EditorMenuState): MenuItem => {
  const off = { disabled: !state.hasDocument };
  const placing = state.mode === 'tilemap' && state.tileMode === 'place';
  const editing = state.mode === 'tilemap' && state.tileMode === 'edit';
  return {
    key: MENU_KEYS.tilemap,
    label: MENU_TEXT.tilemap,
    icon: 'map',
    children: [
      menuItem(SHEET_COMMAND.modeTilemap, 'Tilemap mode', { ...off, checked: state.mode === 'tilemap' }),
      menuItem(ID.placeTiles, 'Place Tile', { ...off, checked: placing }),
      menuItem(ID.editTile, 'Edit Tile', { ...off, checked: editing }),
      'separator',
      menuItem(ID.newTileset, 'New tileset...', off),
      menuItem(ID.newTilemap, 'New tilemap...', off),
      menuItem(ID.addTile, 'Add tile', off),
      menuItem(ID.duplicateTile, 'Duplicate tile', off),
      menuItem(ID.deleteTile, 'Delete tile...', off),
      'separator',
      menuItem(ID.flipX, 'Flip placed tile X', off),
      menuItem(ID.flipY, 'Flip placed tile Y', off),
      menuItem(ID.turn, 'Rotate placed tile 90', off),
      'separator',
      menuItem(ID.makeUnique, 'Make selected cells unique', off),
      menuItem(ID.replaceSelection, 'Replace tile in selection', off),
      menuItem(ID.replaceEverywhere, 'Replace tile on the layer', off),
      menuItem(ID.clearCells, 'Clear selected cells', off),
      'separator',
      menuItem(ID.layerUp, 'Move map layer up', off),
      menuItem(ID.layerDown, 'Move map layer down', off),
    ],
  };
};

export { tilemapMenu };
