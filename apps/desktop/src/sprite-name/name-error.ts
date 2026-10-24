/* @layer renderer-app @kind logic */
import { CONTROL_CHARACTERS, MAX_NAME_LENGTH, nameKey } from '@bxel/document';
import { NAME_TEXT } from './sprite-name.constants';

const nameError = (name: string, taken: readonly string[]): string | null => {
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH || CONTROL_CHARACTERS.test(trimmed)) return NAME_TEXT.invalid;
  const key = nameKey(trimmed);
  return taken.some((each) => nameKey(each) === key) ? NAME_TEXT.taken(trimmed) : null;
};

export { nameError };
