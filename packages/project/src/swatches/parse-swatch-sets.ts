/* @layer core @kind logic */
import { MAX_SWATCH_SETS } from './swatch.constants';
import { swatchSetSchema } from './swatch-set-schema';
import type { SwatchSet } from './swatch.type';

const parseSwatchSets = (value: unknown): readonly SwatchSet[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const kept: SwatchSet[] = [];
  for (const entry of value as unknown[]) {
    const parsed = swatchSetSchema.safeParse(entry);
    if (!parsed.success || seen.has(parsed.data.setId)) continue;
    seen.add(parsed.data.setId);
    kept.push(parsed.data);
  }
  return kept.slice(0, MAX_SWATCH_SETS);
};

export { parseSwatchSets };
