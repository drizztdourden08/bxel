/* @layer core @kind logic */
import type { FolderId } from '../ids/id.type';
import type { ProjectFolder } from '../manifest/manifest.type';
import { safeSegment } from '../paths/safe-segment';
import { uniqueName } from '../paths/unique-name';
import { FOLDER_DIR_FALLBACK, FOLDER_DIR_ROOM } from './pack.constants';

const folderDirs = (folders: readonly Pick<ProjectFolder, 'folderId' | 'name'>[]): ReadonlyMap<FolderId, string> => {
  const taken = new Set<string>();
  return new Map(
    folders.map((folder) => [
      folder.folderId,
      uniqueName(safeSegment(folder.name, FOLDER_DIR_FALLBACK, FOLDER_DIR_ROOM), '', taken),
    ]),
  );
};

export { folderDirs };
