/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { SpriteMode } from '../stores/sprite-store.type';
import type { TileEditMode } from '../stores/tilemap-store.type';

const editSpriteId = (mode: SpriteMode, tileMode: TileEditMode, tile: SpriteId | null, sprite: SpriteId | null): SpriteId | null =>
  mode === 'tilemap' && tileMode === 'edit' && tile !== null ? tile : sprite;

export { editSpriteId };
