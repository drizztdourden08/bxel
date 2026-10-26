/* @layer core @kind logic */
import type { AnimationId } from '../model/ids.type';
import type { Tile } from '../model/tilemap.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const stripped = (tile: Tile): Tile => {
  const { animation: _animation, ...rest } = tile;
  return rest;
};

const detachTileAnimation = (draft: Draft, animationId: AnimationId): number => {
  let count = 0;
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    tilesets: artwork.tilesets.map((tileset) => {
      const tiles = tileset.tiles.map((tile) => {
        if (tile.animation?.animationId !== animationId) return tile;
        count += 1;
        return stripped(tile);
      });
      return tiles.some((tile, index) => tile !== tileset.tiles[index]) ? { ...tileset, tiles } : tileset;
    }),
  }));
  return count;
};

export { detachTileAnimation };
