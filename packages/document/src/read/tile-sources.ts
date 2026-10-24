/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { Tileset } from '../model/tilemap.type';
import { findTile } from './find-tile';
import { tileSource } from './tile-source';

const tileSources = (artwork: Artwork, tileset: Tileset): ((key: number) => Uint8Array | null) => {
  const cache = new Map<number, Uint8Array | null>();
  return (key) => {
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    const tile = findTile(tileset, key);
    const source = tile ? tileSource(artwork, tile) : null;
    cache.set(key, source);
    return source;
  };
};

export { tileSources };
