/* @layer renderer-app @kind logic */
import type { ProjectManifest } from '@bxel/project';
import { PROJECT_SUBFOLDERS } from './project.constants';

const withSubfolders = (manifest: ProjectManifest): ProjectManifest => {
  const folderId = manifest.settings.newFiles.folderId;
  return {
    ...manifest,
    settings: {
      ...manifest.settings,
      newFiles: { folderId, path: PROJECT_SUBFOLDERS.newFiles },
      exports: { folderId, path: PROJECT_SUBFOLDERS.exports },
    },
  };
};

export { withSubfolders };
