/* @layer core @kind logic */
import { addSprite } from '../../draft/add-sprite';
import { cloneSprite } from '../../draft/clone-sprite';
import type { Draft } from '../../draft/draft.type';
import type { TileId } from '../../model/ids.type';
import type { Tile, Tileset } from '../../model/tilemap.type';
import { requireSprite } from '../../read/require-sprite';
import { freeName } from '../layer/free-name';

const copyTiles = (draft: Draft, source: Tileset): readonly Tile[] =>
  source.tiles.map((tile) => {
    const original = requireSprite(draft.artwork, tile.spriteId);
    const name = freeName(
      draft.artwork.sprites.map((sprite) => sprite.name),
      original.name,
    );
    const copy = cloneSprite(draft.ids, original, name);
    addSprite(draft, copy);
    return { id: draft.ids.next('til') as TileId, key: tile.key, spriteId: copy.id, ...(tile.collision ? { collision: tile.collision } : {}) };
  });

export { copyTiles };
