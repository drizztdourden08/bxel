/* @layer core @kind logic */
import type { AssetKey } from './asset-key.type';

const dedupeKeys = (keys: readonly AssetKey[]): readonly AssetKey[] => {
  const seen = new Map<string, AssetKey>();
  for (const key of keys) {
    const name = `${key.kind}:${key.id}`;
    if (!seen.has(name)) seen.set(name, key);
  }
  return [...seen.values()];
};

export { dedupeKeys };
