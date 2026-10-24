/* @layer core @kind logic */
import { normalizeAbsolute } from './normalize-absolute';
import { pathKey } from './path-key';

const isSamePath = (first: string, second: string): boolean => {
  const left = normalizeAbsolute(first);
  const right = normalizeAbsolute(second);
  return left !== undefined && right !== undefined && pathKey(left) === pathKey(right);
};

export { isSamePath };
