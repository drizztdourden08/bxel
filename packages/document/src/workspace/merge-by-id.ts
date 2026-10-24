/* @layer core @kind logic */
import { canonicalJson } from '../native/v2/canonical-json';
import type { Merged } from './merged.type';

const mergeById = <T extends { readonly id: string }>(owned: readonly T[], borrowed: readonly T[]): Merged<T> => {
  const ownedIds = new Set(owned.map((item) => item.id));
  const kept = new Map<string, T>();
  const divergent: string[] = [];
  for (const item of [...owned, ...borrowed]) {
    const first = kept.get(item.id);
    if (first === undefined) kept.set(item.id, item);
    else if (!ownedIds.has(item.id) && canonicalJson(first) !== canonicalJson(item)) divergent.push(item.id);
  }
  return { items: [...kept.values()], divergent };
};

export { mergeById };
