/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import { ANIMATION_COMMAND } from '../keymap/animation-command-id.constants';
import { COLLISION_COMMAND } from '../keymap/collision-command-id.constants';
import { TILEMAP_COMMAND } from '../keymap/tilemap-command-id.constants';
import type { TileEditMode } from '../stores/tilemap-store.type';
import type { HintSpec } from '../views/ActionHint';

const TILE_TEXT = {
  mode: 'Tile mode',
  place: 'Place Tile',
  edit: 'Edit Tile',
  collisionCaption: 'Collision',
  animateCaption: 'Animate tiles',
  switchTo: (mode: string): string => `Switch to ${mode}`,
} as const;

const TILE_MODE_ICONS: Readonly<Record<TileEditMode, IconName>> = { place: 'pixel-stamp', edit: 'pixel-pencil' };

const TILE_MODE_HINTS: Readonly<Record<TileEditMode, HintSpec>> = {
  place: {
    name: TILE_TEXT.place,
    description: 'Pick tiles and place them on the map. The pixels of a tile are never changed.',
    shortcuts: [{ command: TILEMAP_COMMAND.placeTiles }, { command: TILEMAP_COMMAND.toggleEdit, label: 'Switch' }],
  },
  edit: {
    name: TILE_TEXT.edit,
    description: 'Draw on the pixels of one tile. Every map cell that uses the tile changes with it.',
    shortcuts: [{ command: TILEMAP_COMMAND.editTile }, { command: TILEMAP_COMMAND.toggleEdit, label: 'Switch' }],
  },
};

const COLLISION_OVERLAY_HINT: HintSpec = {
  name: 'Show collision',
  description: 'Draw the collision shape of every placed tile over the map.',
  shortcuts: [{ command: COLLISION_COMMAND.toggleOverlay }],
};

const ANIMATE_TILES_HINT: HintSpec = {
  name: 'Animate tiles',
  description: 'Play the animated tiles on the map. It pauses while you drag, and starts off when the system asks for less motion.',
  shortcuts: [{ command: ANIMATION_COMMAND.toggleTiles }],
};

export { ANIMATE_TILES_HINT, COLLISION_OVERLAY_HINT, TILE_MODE_HINTS, TILE_MODE_ICONS, TILE_TEXT };
