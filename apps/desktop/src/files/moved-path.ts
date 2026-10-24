/* @layer renderer-app @kind logic */
import { relativeInside } from '@bxel/project';

const movedPath = (path: string, from: string, to: string | null): string | null => {
  const rel = relativeInside(from, path);
  if (rel === undefined) return path;
  if (to === null) return null;
  return rel === '' ? to : `${to.replace(/\/+$/, '')}/${rel}`;
};

export { movedPath };
