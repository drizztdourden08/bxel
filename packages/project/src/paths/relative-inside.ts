/* @layer core @kind logic */
import { isInside } from './is-inside';
import { normalizeAbsolute } from './normalize-absolute';

const relativeInside = (folderRealPath: string, path: string): string | undefined => {
  const folder = normalizeAbsolute(folderRealPath);
  const target = normalizeAbsolute(path);
  if (folder === undefined || target === undefined || !isInside(target, folder)) return undefined;
  const base = folder.replace(/\/$/, '');
  return target.slice(base.length + 1);
};

export { relativeInside };
