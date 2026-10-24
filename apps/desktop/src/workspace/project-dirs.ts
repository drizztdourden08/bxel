/* @layer renderer-app @kind logic */
import { ROOT_FOLDER_PATH } from '@bxel/project';
import type { OpenProject } from '../project/project.type';
import { ROLE_OF_KIND, SAVE_ORDER } from './workspace.constants';
import type { AssetDirs } from './workspace.type';

const projectDirs = (project: OpenProject): AssetDirs => {
  const stored = project.manifest.folders[0];
  const folder = project.folders.find((each) => each.folderId === stored?.folderId);
  if (!stored || !folder) return {};
  const base = folder.path.replace(/[\\/]+$/, '');
  return Object.fromEntries(
    SAVE_ORDER.flatMap((kind) => {
      const role = ROLE_OF_KIND[kind];
      const path = role === undefined ? undefined : stored.roles[role];
      if (path === undefined) return [[kind, base]];
      return [[kind, path === ROOT_FOLDER_PATH ? base : `${base}/${path}`]];
    }),
  );
};

export { projectDirs };
