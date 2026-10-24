/* @layer renderer-app @kind logic */
import { isNativeAsset, relativeInside } from '@bxel/project';
import type { FolderLocation } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toSlashes } from '../workspace/to-slashes';
import { NATIVE_EXTENSIONS } from '../workspace/workspace.constants';
import type { OpenProject } from './project.type';

const packLocations = async (documents: DocumentsPort, project: OpenProject): Promise<readonly FolderLocation[]> => {
  const found: FolderLocation[] = [];
  for (const folder of project.folders.filter((each) => each.granted)) {
    const listing = await documents.list(folder.path, { recursive: true, extensions: [...NATIVE_EXTENSIONS] });
    for (const entry of listing.entries) {
      const path = relativeInside(folder.path, entry.path);
      if (entry.kind === 'file' && isNativeAsset(entry.name) && path !== undefined) found.push({ folderId: folder.folderId, path: toSlashes(path) });
    }
  }
  return found;
};

export { packLocations };
