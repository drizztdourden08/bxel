/* @layer core @kind logic */
import type { FolderRoles, DocumentFolder } from '../project-document/project-document.type';
import { DEFAULT_ROLE_PATHS } from '../project-document/project-document.constants';
import type { ProjectFolder, ProjectManifest } from '../manifest/manifest.type';

const rolesOf = (manifest: ProjectManifest, folder: ProjectFolder): FolderRoles => {
  const { newFiles, exports } = manifest.settings;
  return {
    ...(folder.folderId === newFiles.folderId
      ? {
          sprites: newFiles.path,
          sheets: DEFAULT_ROLE_PATHS.sheets,
          palettes: DEFAULT_ROLE_PATHS.palettes,
          tilemaps: DEFAULT_ROLE_PATHS.tilemaps,
        }
      : {}),
    ...(folder.folderId === exports.folderId ? { exports: exports.path } : {}),
  };
};

const migratedFolders = (manifest: ProjectManifest): readonly DocumentFolder[] =>
  manifest.folders.map((folder) => ({ ...folder, roles: rolesOf(manifest, folder) }));

export { migratedFolders };
