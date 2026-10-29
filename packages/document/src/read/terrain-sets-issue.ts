/* @layer core @kind logic */
import type { TerrainSet, Tileset } from '../model/tilemap.type';
import { TERRAIN_SLOTS } from '../terrain/terrain.constants';

const setIssue = (set: TerrainSet, known: ReadonlySet<number>): string | null => {
  if (set.slots.length !== TERRAIN_SLOTS[set.kind]) return `Terrain set "${set.name}" of kind ${set.kind} holds ${TERRAIN_SLOTS[set.kind]} slots.`;
  for (const variant of set.slots.flat()) {
    if (!known.has(variant.key)) return `Terrain set "${set.name}" names tile ${variant.key}, which the tileset does not have.`;
    if (!Number.isFinite(variant.weight) || variant.weight < 0) return `Terrain set "${set.name}" has a variant with a weight below 0.`;
  }
  return null;
};

const terrainSetsIssue = (sets: readonly TerrainSet[], tileset: Tileset): string | null => {
  const known = new Set(tileset.tiles.map((tile) => tile.key));
  if (new Set(sets.map((set) => set.id)).size !== sets.length) return 'Terrain set ids are unique.';
  if (new Set(sets.map((set) => set.name.toLowerCase())).size !== sets.length) return 'Terrain set names are unique.';
  return sets.map((set) => setIssue(set, known)).find((issue) => issue !== null) ?? null;
};

export { terrainSetsIssue };
