/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { ANIMATION_COMMAND } from '../keymap/animation-command-id.constants';
import { COLLISION_COMMAND } from '../keymap/collision-command-id.constants';
import { TERRAIN_COMMAND } from '../keymap/terrain-command-id.constants';
import { TILEMAP_COMMAND as ID } from '../keymap/tilemap-command-id.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';

const tilemapItems = (state: EditorMenuState): MenuEntry[] => {
  const { context } = state;
  const item = (id: string, label: string, checked?: boolean) => ruledItem(context, id, label, checked === undefined ? {} : { checked });
  return tidyMenu([
    item(ID.placeTiles, 'Place Tile', context.tileMode === 'place'),
    item(ID.editTile, 'Edit Tile', context.tileMode === 'edit'),
    'separator',
    item(ID.newTileset, 'New tileset...'),
    item(ID.newTilemap, 'New tilemap...'),
    item(ID.addTile, 'Add tile'),
    item(ID.duplicateTile, 'Duplicate tile'),
    item(ID.deleteTile, 'Delete tile...'),
    'separator',
    item(ID.flipX, 'Flip placed tile X'),
    item(ID.flipY, 'Flip placed tile Y'),
    item(ID.turn, 'Rotate placed tile 90'),
    'separator',
    item(ID.makeUnique, 'Make selected cells unique'),
    item(ID.replaceSelection, 'Replace tile in selection'),
    item(ID.replaceEverywhere, 'Replace tile on the layer'),
    item(ID.clearCells, 'Clear selected cells'),
    'separator',
    item(COLLISION_COMMAND.toggleOverlay, 'Show collision', state.collision),
    item(TERRAIN_COMMAND.toggleBrush, 'Terrain brush', state.terrainBrush),
    item(ANIMATION_COMMAND.toggleTiles, 'Animate tiles', state.animateTiles),
  ]);
};

export { tilemapItems };
