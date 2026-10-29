/* @layer core @kind logic */
import type { Tileset } from '../../model/tilemap.type';

const terrainWithoutKey = (tileset: Tileset, key: number): Pick<Tileset, 'terrain' | 'terrainSets'> => ({
  ...(tileset.terrainSets
    ? { terrainSets: tileset.terrainSets.map((set) => ({ ...set, slots: set.slots.map((slot) => slot.filter((variant) => variant.key !== key)) })) }
    : {}),
  ...(tileset.terrain ? { terrain: { ...tileset.terrain, keys: tileset.terrain.keys.map((slot) => (slot === key ? 0 : slot)) } } : {}),
});

export { terrainWithoutKey };
