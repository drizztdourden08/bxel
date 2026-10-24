/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';

const uniquePresetName = (name: string, taken: ReadonlySet<string>): string => {
  let next = name;
  for (let copy = 2; taken.has(nameKey(next)); copy += 1) next = `${name} (${copy})`;
  return next;
};

export { uniquePresetName };
