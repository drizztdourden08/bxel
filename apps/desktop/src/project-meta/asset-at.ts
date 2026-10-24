/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import type { ProjectCover, ResolvedFolder } from '@bxel/project';

const assetAt = (folders: readonly ResolvedFolder[], location: ProjectCover): string | null => {
  const folder = folders.find((each) => each.folderId === location.folderId);
  if (!folder) return null;
  const joined = joinInside(folder.path, location.path);
  return joined.ok ? joined.value : null;
};

export { assetAt };
