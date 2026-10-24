/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { cellsToBytes } from './cells-to-bytes';
import type { Blob } from './collect-blobs.type';
import { entryPaths } from './entry-paths';

const byPath = ([left]: Blob, [right]: Blob): number => (left < right ? -1 : 1);

const collectBlobs = (artwork: Artwork): ReadonlyMap<string, Uint8Array> => {
  const cels = artwork.sprites
    .flatMap((sprite) => Object.values(sprite.cels))
    .map((cel): Blob => [entryPaths.cel(cel.id), cel.pixels])
    .sort(byPath);
  const maps = artwork.tilemaps
    .flatMap((tilemap) => tilemap.layers)
    .map((layer): Blob => [entryPaths.tilemapLayer(layer.id), cellsToBytes(layer.cells)])
    .sort(byPath);
  return new Map([...cels, ...maps]);
};

export { collectBlobs };
