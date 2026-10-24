/* @layer core @kind logic */
import type { TerrainRules, Tileset } from '../model/tilemap.type';
import { TERRAIN_SLOTS } from '../terrain/terrain.constants';

const terrainIssue = (rules: TerrainRules, tileset: Tileset): string | null => {
  if (rules.keys.length !== TERRAIN_SLOTS[rules.kind]) return `A ${rules.kind} rule set holds ${TERRAIN_SLOTS[rules.kind]} slots.`;
  const known = new Set(tileset.tiles.map((tile) => tile.key));
  const lost = rules.keys.find((key) => key !== 0 && !known.has(key));
  return lost === undefined ? null : `Terrain slot names tile ${lost}, which tileset "${tileset.name}" does not have.`;
};

export { terrainIssue };
