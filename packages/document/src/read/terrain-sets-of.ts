/* @layer core @kind logic */
import type { TerrainSet, Tileset } from '../model/tilemap.type';
import { LEGACY_SET_ID } from './terrain-sets-of.constants';

const terrainSetsOf = (tileset: Tileset): readonly TerrainSet[] => {
  if (tileset.terrainSets) return tileset.terrainSets;
  const rules = tileset.terrain;
  if (!rules) return [];
  const slots = rules.keys.map((key) => (key === 0 ? [] : [{ key, weight: 1 }]));
  return [{ id: LEGACY_SET_ID, name: 'Terrain', kind: rules.kind, slots }];
};

export { terrainSetsOf };
