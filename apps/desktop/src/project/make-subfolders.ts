/* @layer renderer-app @kind logic */
import { resolveFolders, roleFolders } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { locationPath } from './location-path';

const makeSubfolders = async (documents: DocumentsPort, folder: string, manifest: ProjectDocument): Promise<void> => {
  const folders = resolveFolders(manifest.folders, folder);
  if (!folders.ok) throw new Error(folders.message);
  for (const location of roleFolders(manifest.folders)) {
    const path = locationPath(folders.value, location);
    if (path !== null) await documents.mkdir(path, { recursive: true });
  }
};

export { makeSubfolders };
