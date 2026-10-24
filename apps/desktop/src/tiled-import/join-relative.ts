/* @layer renderer-app @kind logic */
import { toSlashes } from '../workspace/to-slashes';
import { ROOTED_PATH } from './tiled-import.constants';

const joinRelative = (basePath: string, relative: string): string => {
  const slashed = toSlashes(relative);
  if (ROOTED_PATH.test(slashed)) return slashed;
  const base = toSlashes(basePath);
  const parts = base.slice(0, Math.max(0, base.lastIndexOf('/'))).split('/');
  for (const part of slashed.split('/')) {
    if (part === '..') parts.pop();
    else if (part !== '.' && part !== '') parts.push(part);
  }
  return parts.join('/');
};

export { joinRelative };
