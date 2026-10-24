/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import { nameError } from '../sprite-name/name-error';

const pieceError = (names: readonly string[], taken: readonly string[]): string | null => {
  const used = new Set(taken.map(nameKey));
  for (const name of names) {
    const invalid = nameError(name, []);
    if (invalid !== null) return invalid;
    if (used.has(nameKey(name))) return nameError(name, [name]);
    used.add(nameKey(name));
  }
  return null;
};

export { pieceError };
