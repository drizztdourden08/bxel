/* @layer core @kind logic */
import { DEFAULT_COLLISION_LAYER } from '../model/tilemap-limits.constants';
import type { Tileset } from '../model/tilemap.type';
import type { Draft } from './draft.type';
import type { CollisionEdit } from './set-tile-collision.type';
import { setTileShapes } from './set-tile-shapes';

const setTileCollision = (draft: Draft, tileset: Tileset, edit: CollisionEdit): void => {
  const { collision } = edit;
  const shapes = collision ? [{ ...collision, layer: edit.layer ?? DEFAULT_COLLISION_LAYER }] : [];
  setTileShapes(draft, tileset, { keys: [edit.key], shapes, mode: 'set', path: edit.path });
};

export { setTileCollision };
