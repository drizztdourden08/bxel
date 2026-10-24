/* @layer core @kind logic */
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';

const chooseLayerName = (requested: string | undefined, taken: readonly string[], fallback: string): string => {
  if (requested === undefined) return fallback;
  const name = checkName(requested);
  assertNameFree(taken, name);
  return name;
};

export { chooseLayerName };
