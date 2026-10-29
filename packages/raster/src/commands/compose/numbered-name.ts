/* @layer core @kind logic */
import { nameKey } from '@bxel/document';

const numberedName = (taken: readonly string[], name: string): string => {
  const used = new Set(taken.map(nameKey));
  if (!used.has(nameKey(name))) return name;
  for (let count = 2; ; count += 1) {
    const candidate = `${name}_${count}`;
    if (!used.has(nameKey(candidate))) return candidate;
  }
};

export { numberedName };
