/* @layer core @kind logic */
import type { AnimationId, TagId } from '../model/ids.type';
import type { Tile } from '../model/tilemap.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const dropTag = (tile: Tile, animationId: AnimationId, gone: ReadonlySet<TagId>): Tile => {
  const { animation } = tile;
  if (animation?.animationId !== animationId) return tile;
  return animation.tagId !== null && gone.has(animation.tagId) ? { ...tile, animation: { ...animation, tagId: null } } : tile;
};

const detachTileTags = (draft: Draft, animationId: AnimationId, gone: ReadonlySet<TagId>): void => {
  if (gone.size === 0) return;
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    tilesets: artwork.tilesets.map((tileset) => {
      const tiles = tileset.tiles.map((tile) => dropTag(tile, animationId, gone));
      return tiles.some((tile, index) => tile !== tileset.tiles[index]) ? { ...tileset, tiles } : tileset;
    }),
  }));
};

export { detachTileTags };
