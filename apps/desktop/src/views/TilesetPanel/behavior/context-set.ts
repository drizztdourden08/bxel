/* @layer renderer-app @kind logic */
import type { TerrainSet } from '@bxel/document';
import { maskOfTile } from '../../../tilemap/terrain/mask-of-tile';

const contextSet = (sets: readonly TerrainSet[], activeId: string | null, key: number): TerrainSet | undefined => {
  const holding = sets.filter((set) => maskOfTile(set, key) !== null);
  return holding.find((set) => set.id === activeId) ?? holding[0];
};

export { contextSet };
