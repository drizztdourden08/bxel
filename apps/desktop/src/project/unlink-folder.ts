/* @layer renderer-app @kind logic */
import { ROOT_FOLDER_PATH } from '@bxel/project';
import type { FolderLocation, ProjectManifest } from '@bxel/project';

const keepOrRoot = (location: FolderLocation, removed: string, root: FolderLocation): FolderLocation =>
  location.folderId === removed ? root : location;

const unlinkFolder = (manifest: ProjectManifest, folderId: string): ProjectManifest => {
  const rootId = manifest.folders[0]?.folderId;
  if (rootId === undefined || rootId === folderId) return manifest;
  const root = { folderId: rootId, path: ROOT_FOLDER_PATH };
  const { newFiles, exports, palette } = manifest.settings;
  return {
    ...manifest,
    folders: manifest.folders.filter((folder) => folder.folderId !== folderId),
    settings: {
      newFiles: keepOrRoot(newFiles, folderId, root),
      exports: keepOrRoot(exports, folderId, root),
      palette: palette?.folderId === folderId ? null : palette,
    },
  };
};

export { unlinkFolder };
