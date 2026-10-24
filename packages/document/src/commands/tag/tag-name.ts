/* @layer core @kind logic */
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';

const tagName = (requested: string, taken: readonly string[]): string => {
  const name = checkName(requested);
  assertNameFree(taken, name);
  return name;
};

export { tagName };
