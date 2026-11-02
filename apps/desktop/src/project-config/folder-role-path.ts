/* @layer renderer-app @kind logic */
import { toSlashes } from '../workspace/to-slashes';

const trimmed = (path: string): string => toSlashes(path).replace(/\/+$/, '');

const folderRolePath = (root: string, target: string): string | null => {
  const base = trimmed(root);
  const to = trimmed(target);
  if (to.toLowerCase() === base.toLowerCase()) return '';
  return to.toLowerCase().startsWith(`${base.toLowerCase()}/`) ? to.slice(base.length + 1) : null;
};

export { folderRolePath };
