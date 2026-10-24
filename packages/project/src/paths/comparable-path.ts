/* @layer core @kind logic */
import { normalizeAbsolute } from './normalize-absolute';
import { pathKey } from './path-key';

const comparablePath = (path: string): string | undefined => {
  const normalized = normalizeAbsolute(path);
  return normalized === undefined ? undefined : pathKey(normalized);
};

export { comparablePath };
