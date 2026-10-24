/* @layer core @kind logic */
import type { TilemapId } from '../model/ids.type';
import type { Tilemap } from '../model/tilemap.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const updateTilemap = (draft: Draft, id: TilemapId, change: (tilemap: Tilemap) => Tilemap): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    tilemaps: artwork.tilemaps.map((tilemap) => (tilemap.id === id ? change(tilemap) : tilemap)),
  }));
};

export { updateTilemap };
