/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import { DEFAULT_COLLISION_LAYER, MAX_COLLISION_LAYERS } from '../model/tilemap-limits.constants';
import type { Tile, TileShape, Tileset } from '../model/tilemap.type';
import { collisionIssue } from '../read/collision-issue';
import type { Draft } from './draft.type';
import type { CollisionEdit, ShapesEdit } from './set-tile-collision.type';
import { updateTileset } from './update-tileset';

const withShapes = (tile: Tile, shapes: readonly TileShape[]): Tile => {
  const { shapes: _shapes, ...rest } = tile;
  return shapes.length > 0 ? { ...rest, shapes } : rest;
};

const merged = (current: readonly TileShape[], shapes: readonly TileShape[], mode: ShapesEdit['mode']): readonly TileShape[] => {
  if (mode === 'set') return shapes;
  if (mode === 'add') return [...current, ...shapes];
  const layers = new Set(shapes.map((shape) => shape.layer));
  return [...current.filter((shape) => !layers.has(shape.layer)), ...shapes];
};

const layersWith = (tileset: Tileset, shapes: readonly TileShape[]): readonly string[] => {
  const known = tileset.collisionLayers ?? [DEFAULT_COLLISION_LAYER];
  const added = [...new Set(shapes.map((shape) => shape.layer))].filter((layer) => !known.includes(layer));
  return [...known, ...added];
};

const setTileShapes = (draft: Draft, tileset: Tileset, edit: ShapesEdit): void => {
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  edit.shapes.forEach((shape, at) => {
    const issue = collisionIssue(shape, size);
    if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, issue, { path: `${edit.path}.${at}` });
  });
  const layers = layersWith(tileset, edit.shapes);
  if (layers.length > MAX_COLLISION_LAYERS) {
    throw fail(ERROR_CODE.LIMIT_REACHED, `A tileset holds at most ${MAX_COLLISION_LAYERS} collision layers.`, { path: edit.path });
  }
  const keys = new Set(edit.keys);
  updateTileset(draft, tileset.id, (current) => ({
    ...current,
    ...(layers.length > (current.collisionLayers ?? [DEFAULT_COLLISION_LAYER]).length ? { collisionLayers: layers } : {}),
    tiles: current.tiles.map((tile) => (keys.has(tile.key) ? withShapes(tile, merged(tile.shapes ?? [], edit.shapes, edit.mode)) : tile)),
  }));
};

const setTileCollision = (draft: Draft, tileset: Tileset, edit: CollisionEdit): void => {
  const { collision } = edit;
  const shapes = collision ? [{ ...collision, layer: edit.layer ?? DEFAULT_COLLISION_LAYER }] : [];
  setTileShapes(draft, tileset, { keys: [edit.key], shapes, mode: 'set', path: edit.path });
};

export { setTileCollision, setTileShapes };
