/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import { cellsToBytes } from './cells-to-bytes';
import type { Blob } from './collect-blobs.type';
import { entryPaths } from './entry-paths';

const byPath = ([left]: Blob, [right]: Blob): number => (left < right ? -1 : 1);

const collectBlobs = (project: Project): ReadonlyMap<string, Uint8Array> => {
  const cels = project.sprites
    .flatMap((sprite) => Object.values(sprite.cels))
    .map((cel): Blob => [entryPaths.cel(cel.id), cel.pixels])
    .sort(byPath);
  const maps = project.tilemaps
    .flatMap((tilemap) => tilemap.layers)
    .map((layer): Blob => [entryPaths.tilemapLayer(layer.id), cellsToBytes(layer.cells)])
    .sort(byPath);
  return new Map([...cels, ...maps]);
};

export { collectBlobs };
