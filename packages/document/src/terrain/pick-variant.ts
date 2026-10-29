/* @layer core @kind logic */
import type { TerrainVariant } from '../model/tilemap.type';

const roll = (seed: number): number => (Math.imul(seed + 1, 2654435761) >>> 0) / 4294967296;

const pickVariant = (variants: readonly TerrainVariant[], seed: number): TerrainVariant | undefined => {
  const total = variants.reduce((sum, variant) => sum + variant.weight, 0);
  if (total <= 0) return variants[0];
  let left = roll(seed) * total;
  for (const variant of variants) {
    left -= variant.weight;
    if (left < 0) return variant;
  }
  return variants[variants.map((variant) => variant.weight > 0).lastIndexOf(true)];
};

export { pickVariant };
