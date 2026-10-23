/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import { nameKey } from './name-key';

const assertNameFree = (others: readonly string[], name: string): void => {
  const key = nameKey(name);
  if (others.some((other) => nameKey(other) === key)) {
    throw fail(ERROR_CODE.NAME_TAKEN, `The name "${name}" is already used here.`);
  }
};

export { assertNameFree };
