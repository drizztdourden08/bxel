/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Tile, TileCollision, Tileset } from '../model/tilemap.type';
import { collisionIssue } from '../read/collision-issue';
import type { Draft } from './draft.type';
import type { CollisionEdit } from './set-tile-collision.type';
import { updateTileset } from './update-tileset';

const withCollision = (tile: Tile, collision: TileCollision | undefined): Tile => {
  const { id, key, spriteId } = tile;
  return collision ? { id, key, spriteId, collision } : { id, key, spriteId };
};

const setTileCollision = (draft: Draft, tileset: Tileset, edit: CollisionEdit): void => {
  const { key, collision } = edit;
  const issue = collision ? collisionIssue(collision, { width: tileset.tileWidth, height: tileset.tileHeight }) : null;
  if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, issue, { path: edit.path });
  updateTileset(draft, tileset.id, (current) => ({
    ...current,
    tiles: current.tiles.map((tile) => (tile.key === key ? withCollision(tile, collision) : tile)),
  }));
};

export { setTileCollision };
