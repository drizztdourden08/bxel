/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { TilesetId } from '../model/ids.type';
import type { MapLayer } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';

const countLayer = (counts: Map<number, number>, layer: MapLayer): void => {
  for (const cell of layer.cells) {
    const key = cellKey(cell);
    if (key !== 0) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
};

const tileUseCounts = (artwork: Artwork, tilesetId: TilesetId): ReadonlyMap<number, number> => {
  const counts = new Map<number, number>();
  const maps = artwork.tilemaps.filter((tilemap) => tilemap.tilesetId === tilesetId);
  for (const layer of maps.flatMap((tilemap) => tilemap.layers)) countLayer(counts, layer);
  return counts;
};

export { tileUseCounts };
