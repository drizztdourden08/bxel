/* @layer core @kind logic */
import type { Tilemap } from '../model/tilemap.type';

const buffersOf = (value: unknown): Set<Uint32Array> => {
  const buffers = new Set<Uint32Array>();
  const maps: readonly Tilemap[] = Array.isArray(value) ? (value as readonly Tilemap[]) : [];
  for (const layer of maps.flatMap((tilemap) => tilemap.layers)) buffers.add(layer.cells);
  return buffers;
};

const unshared = (own: ReadonlySet<Uint32Array>, other: ReadonlySet<Uint32Array>): number =>
  [...own].reduce((sum, cells) => (other.has(cells) ? sum : sum + cells.byteLength), 0);

const tilemapBytes = (before: unknown, after: unknown): number => {
  const prior = buffersOf(before);
  const next = buffersOf(after);
  return unshared(prior, next) + unshared(next, prior);
};

export { tilemapBytes };
