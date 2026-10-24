/* @layer core @kind logic */
import { normalizeAbsolute } from './normalize-absolute';
import { pathKey } from './path-key';

const isInside = (childRealPath: string, folderRealPath: string): boolean => {
  const child = normalizeAbsolute(childRealPath);
  const folder = normalizeAbsolute(folderRealPath);
  if (child === undefined || folder === undefined) return false;
  return pathKey(child).startsWith(pathKey(folder));
};

export { isInside };
