/* @layer renderer-app @kind logic */
import { findTile } from '@bxel/document';
import type { Tileset } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';

const weightOf = (tileset: Tileset, key: number): number => {
  const probability = findTile(tileset, key)?.probability;
  return key === 0 ? 0 : (probability ?? 1);
};

const scatterKey = (stamp: TileStamp, tileset: Tileset, roll: number): number => {
  const weights = stamp.keys.map((key) => weightOf(tileset, key));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return 0;
  let left = roll * total;
  for (const [at, weight] of weights.entries()) {
    left -= weight;
    if (left < 0) return stamp.keys[at] ?? 0;
  }
  const lastWeighted = weights.map((weight) => weight > 0).lastIndexOf(true);
  return stamp.keys[lastWeighted] ?? 0;
};

export { scatterKey };
