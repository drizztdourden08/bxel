/* @layer renderer-app @kind logic */
import { joinInside, ROOT_FOLDER_PATH } from '@bxel/project';
import type { FolderLocation, ResolvedFolder } from '@bxel/project';

const locationPath = (folders: readonly ResolvedFolder[], location: FolderLocation): string | null => {
  const folder = folders.find((each) => each.folderId === location.folderId);
  if (!folder) return null;
  if (location.path === ROOT_FOLDER_PATH) return folder.path;
  const joined = joinInside(folder.path, location.path);
  return joined.ok ? joined.value : null;
};

export { locationPath };
