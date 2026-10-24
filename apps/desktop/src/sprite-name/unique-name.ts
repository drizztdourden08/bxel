/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';

const uniqueName = (base: string, taken: readonly string[]): string => {
  const keys = new Set(taken.map(nameKey));
  if (!keys.has(nameKey(base))) return base;
  let count = 2;
  while (keys.has(nameKey(`${base}_${count}`))) count += 1;
  return `${base}_${count}`;
};

export { uniqueName };
