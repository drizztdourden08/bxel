/* @layer renderer-app @kind logic */
import type { FolderMatch } from './match-folder.type';

const matchFolder = (typed: string, folderPaths: readonly string[]): FolderMatch => {
  const wanted = typed.trim().replace(/\\/g, '/').replace(/\/$/, '');
  if (wanted === '') return { found: true, path: null };
  const path = folderPaths.find((each) => each.toLowerCase() === wanted.toLowerCase());
  return path === undefined ? { found: false, path: null } : { found: true, path };
};

export { matchFolder };
