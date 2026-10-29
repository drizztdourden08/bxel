/* @layer core @kind logic */
import { addSprite } from '../../draft/add-sprite';
import type { Draft } from '../../draft/draft.type';
import { updateTileset } from '../../draft/update-tileset';
import type { TileId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';
import type { Tile, Tileset } from '../../model/tilemap.type';

type TileKeep = Pick<Tile, 'shapes' | 'type' | 'probability' | 'turns' | 'data'>;

const attachTile = (draft: Draft, tileset: Tileset, sprite: Sprite, keep: TileKeep = {}): number => {
  const key = tileset.nextKey;
  const tile: Tile = { id: draft.ids.next('til') as TileId, key, spriteId: sprite.id, ...keep };
  addSprite(draft, sprite);
  updateTileset(draft, tileset.id, (current) => ({ ...current, nextKey: key + 1, tiles: [...current.tiles, tile] }));
  return key;
};

export type { TileKeep };
export { attachTile };
