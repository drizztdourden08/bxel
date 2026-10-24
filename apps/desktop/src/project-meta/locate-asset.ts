/* @layer renderer-app @kind logic */
import { relativeInside } from '@bxel/project';
import type { ProjectCover, ResolvedFolder } from '@bxel/project';

const locateAsset = (folders: readonly ResolvedFolder[], path: string): ProjectCover | null => {
  const found = folders
    .flatMap((folder) => {
      const inside = relativeInside(folder.path, path);
      return inside === undefined || inside === '' ? [] : [{ folderId: folder.folderId, path: inside }];
    })
    .sort((left, right) => left.path.length - right.path.length);
  return found[0] ?? null;
};

export { locateAsset };
