/* @layer renderer-app @kind logic */
import { isGroupItem } from '@bxel/document';
import type { Artwork, TilemapId } from '@bxel/document';

const layersShown = (artwork: Artwork, tilemapId: TilemapId, shows: (index: number) => boolean): Artwork => ({
  ...artwork,
  tilemaps: artwork.tilemaps.map((map) =>
    map.id === tilemapId
      ? { ...map, layers: map.layers.map((layer, index) => (isGroupItem(layer) || shows(index) ? layer : { ...layer, visible: false })) }
      : map,
  ),
});

export { layersShown };
