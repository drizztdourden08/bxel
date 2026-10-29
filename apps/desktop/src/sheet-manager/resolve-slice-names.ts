/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import { numberedName } from '@bxel/raster';
import type { SliceExistingRule } from './compose.type';

const resolveSliceNames = (names: readonly string[], others: readonly string[], rule: SliceExistingRule): string[] => {
  const taken = [...others];
  const used = (name: string): boolean => taken.some((each) => nameKey(each) === nameKey(name));
  const kept = rule === 'skip' ? names.filter((name) => !used(name)) : [...names];
  if (rule !== 'keep') return kept;
  return kept.map((name) => {
    const next = numberedName(taken, name);
    taken.push(next);
    return next;
  });
};

export { resolveSliceNames };
