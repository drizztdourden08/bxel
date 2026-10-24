/* @layer core @kind logic */
import { ROOT_FOLDER_PATH } from '../manifest/manifest.constants';
import type { FolderLocation } from '../manifest/manifest.type';
import { FOLDER_ROLES } from './project-document.constants';
import type { DocumentFolder } from './project-document.type';

const roleFolders = (folders: readonly DocumentFolder[]): readonly FolderLocation[] => {
  const seen = new Set<string>();
  const found: FolderLocation[] = [];
  for (const folder of folders) {
    for (const role of FOLDER_ROLES) {
      const path = folder.roles[role];
      const key = `${folder.folderId}/${path ?? ''}`;
      if (path === undefined || path === ROOT_FOLDER_PATH || seen.has(key)) continue;
      seen.add(key);
      found.push({ folderId: folder.folderId, path });
    }
  }
  return found;
};

export { roleFolders };
