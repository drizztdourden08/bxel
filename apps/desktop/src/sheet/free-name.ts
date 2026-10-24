/* @layer renderer-app @kind logic */
import { MAX_NAME_LENGTH, nameKey } from '@bxel/document';

const freeName = (stem: string, taken: readonly string[]): string => {
  const keys = new Set(taken.map(nameKey));
  const base = stem.trim().slice(0, MAX_NAME_LENGTH - 4).trim();
  for (let count = 1; count <= taken.length + 1; count += 1) {
    const candidate = count === 1 ? base : `${base} ${count}`;
    if (!keys.has(nameKey(candidate))) return candidate;
  }
  return base;
};

export { freeName };
