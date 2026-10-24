/* @layer core @kind logic */
import type { ManifestSeed } from '../manifest/manifest.type';
import { MANIFEST_FORMAT, ROOT_FOLDER_PATH } from '../manifest/manifest.constants';
import { DEFAULT_ROLE_PATHS, PROJECT_DOCUMENT_VERSION } from './project-document.constants';
import type { ProjectDocument } from './project-document.type';

const createProjectDocument = ({ projectId, folderId, name }: ManifestSeed): ProjectDocument => ({
  format: MANIFEST_FORMAT,
  formatVersion: PROJECT_DOCUMENT_VERSION,
  projectId,
  name,
  folders: [{ folderId, name, path: ROOT_FOLDER_PATH, roles: { ...DEFAULT_ROLE_PATHS } }],
  defaults: {},
  assistant: { access: 'off' },
});

export { createProjectDocument };
