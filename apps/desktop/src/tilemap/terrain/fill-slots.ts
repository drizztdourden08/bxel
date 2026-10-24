/* @layer renderer-app @kind logic */
import type { TerrainRules, Tileset } from '@bxel/document';

const fillSlots = (rules: TerrainRules, tileset: Tileset, start: number): TerrainRules => {
  const from = Math.max(0, tileset.tiles.findIndex((tile) => tile.key === start));
  return { kind: rules.kind, keys: rules.keys.map((_, at) => tileset.tiles[from + at]?.key ?? 0) };
};

export { fillSlots };
