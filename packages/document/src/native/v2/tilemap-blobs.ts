/* @layer core @kind logic */
import type { Tilemap } from '../../model/tilemap.type';
import { cellsToBytes } from '../cells-to-bytes';
import { entryPaths } from '../entry-paths';

const byName = ([left]: readonly [string, Uint8Array], [right]: readonly [string, Uint8Array]): number =>
  left < right ? -1 : 1;

const tilemapBlobs = (tilemap: Tilemap): ReadonlyMap<string, Uint8Array> =>
  new Map(
    tilemap.layers
      .map((layer): [string, Uint8Array] => [entryPaths.tilemapLayer(layer.id), cellsToBytes(layer.cells)])
      .sort(byName),
  );

export { tilemapBlobs };
