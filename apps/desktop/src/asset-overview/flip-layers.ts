/* @layer renderer-app @kind logic */
import type { Artwork, TilemapId } from '@bxel/document';

const flipLayers = (artwork: Artwork, id: string, flipped: ReadonlySet<string>): Artwork => {
  if (flipped.size === 0) return artwork;
  const tilemaps = artwork.tilemaps.map((tilemap) =>
    tilemap.id === (id as TilemapId) ? { ...tilemap, layers: tilemap.layers.map((layer) => (flipped.has(layer.id) ? { ...layer, visible: !layer.visible } : layer)) } : tilemap,
  );
  return { ...artwork, tilemaps };
};

export { flipLayers };
