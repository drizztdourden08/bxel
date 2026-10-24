/* @layer core @kind logic */
import type { TilesetId } from '../model/ids.type';
import type { Tileset } from '../model/tilemap.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const updateTileset = (draft: Draft, id: TilesetId, change: (tileset: Tileset) => Tileset): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    tilesets: artwork.tilesets.map((tileset) => (tileset.id === id ? change(tileset) : tileset)),
  }));
};

export { updateTileset };
