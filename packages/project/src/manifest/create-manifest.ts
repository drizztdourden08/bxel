/* @layer core @kind logic */
import { MANIFEST_FORMAT, MANIFEST_VERSION, ROOT_FOLDER_PATH } from './manifest.constants';
import type { ManifestSeed, ProjectManifest } from './manifest.type';

const createManifest = ({ projectId, folderId, name }: ManifestSeed): ProjectManifest => ({
  format: MANIFEST_FORMAT,
  formatVersion: MANIFEST_VERSION,
  projectId,
  name,
  folders: [{ folderId, name, path: ROOT_FOLDER_PATH }],
  settings: {
    newFiles: { folderId, path: ROOT_FOLDER_PATH },
    exports: { folderId, path: ROOT_FOLDER_PATH },
    palette: null,
  },
  swatchSets: [],
  assistant: { access: 'off' },
});

export { createManifest };
