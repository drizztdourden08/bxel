/* @layer renderer-app @kind logic */
import { ROOT_FOLDER_PATH } from '@bxel/project';
import type { DocumentFolder } from '@bxel/project';
import { toSlashes } from './to-slashes';
import { ROLE_OF_KIND, SAVE_ORDER } from './workspace.constants';
import type { AssetDirs } from './workspace.type';

const roleDirs = (stored: DocumentFolder, folderPath: string): AssetDirs => {
  const base = toSlashes(folderPath).replace(/\/+$/, '');
  return Object.fromEntries(
    SAVE_ORDER.map((kind) => {
      const role = ROLE_OF_KIND[kind];
      const path = role === undefined ? undefined : stored.roles[role];
      return [kind, path === undefined || path === ROOT_FOLDER_PATH ? base : `${base}/${path}`];
    }),
  );
};

export { roleDirs };
