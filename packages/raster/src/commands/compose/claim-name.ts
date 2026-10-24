/* @layer core @kind logic */
import { assertNameFree, checkName } from '@bxel/document';

const claimName = (taken: string[], name: string): string => {
  const label = checkName(name);
  assertNameFree(taken, label);
  taken.push(label);
  return label;
};

export { claimName };
