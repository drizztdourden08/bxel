/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import { CONTROL_CHARACTERS, MAX_NAME_LENGTH } from '../model/limits.constants';

const checkName = (name: string): string => {
  const trimmed = name.trim();
  const valid = trimmed.length >= 1 && trimmed.length <= MAX_NAME_LENGTH && !CONTROL_CHARACTERS.test(trimmed);
  if (!valid) {
    throw fail(ERROR_CODE.NAME_INVALID, `A name has 1 to ${MAX_NAME_LENGTH} printable characters.`);
  }
  return trimmed;
};

export { checkName };
