/* @layer renderer-app @kind logic */
import { isManifestFile, resolveFolders } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { findManifestFile } from '../project/find-manifest-file';
import { readProjectFile } from '../project/read-project-file';
import { regrantFolder } from '../project/regrant-folder';
import { MANAGER_TEXT } from './project-manager.constants';
import type { DiskManifestResult } from './project-manager.type';

const fail = (message: string): DiskManifestResult => ({ ok: false, message });

const readDiskManifest = async (documents: DocumentsPort, folder: string): Promise<DiskManifestResult> => {
  const root = await regrantFolder(documents, folder);
  if (root === null) return fail(MANAGER_TEXT.noAccess);
  const found = await findManifestFile(documents, root);
  if (found === null) return fail(MANAGER_TEXT.noManifest);
  if (isManifestFile(found.name)) return fail(MANAGER_TEXT.older);
  const loaded = await readProjectFile(documents, found.path);
  if (!loaded.ok) return fail(loaded.message);
  const resolved = resolveFolders(loaded.value.manifest.folders, root);
  if (!resolved.ok) return fail(resolved.message);
  return { ok: true, value: { root, manifest: loaded.value.manifest, projectFile: loaded.value.projectFile, folders: resolved.value } };
};

export { readDiskManifest };
