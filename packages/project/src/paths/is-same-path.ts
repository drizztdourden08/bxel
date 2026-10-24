/* @layer core @kind logic */
import { comparablePath } from './comparable-path';

const isSamePath = (first: string, second: string): boolean => {
  const left = comparablePath(first);
  return left !== undefined && left === comparablePath(second);
};

export { isSamePath };
