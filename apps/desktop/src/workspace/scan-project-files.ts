/* @layer renderer-app @kind logic */
import { isNativeAsset, isUnderRole, relativeInside } from '@bxel/project';
import type { DocumentFolder } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { OpenProject, ProjectFolderState } from '../project/project.type';
import { toSlashes } from './to-slashes';
import { NATIVE_EXTENSIONS } from './workspace.constants';

const scanFolder = async (documents: DocumentsPort, folder: ProjectFolderState, stored: DocumentFolder | undefined): Promise<readonly string[]> => {
  const listing = await documents.list(folder.path, { recursive: true, extensions: [...NATIVE_EXTENSIONS] }).catch(() => ({ entries: [] }));
  return listing.entries.flatMap((entry) => {
    if (entry.kind !== 'file' || !isNativeAsset(entry.name)) return [];
    const relative = relativeInside(folder.path, entry.path);
    if (relative === undefined || (stored !== undefined && isUnderRole(stored, 'exports', relative))) return [];
    return [toSlashes(entry.path)];
  });
};

const scanProjectFiles = async (documents: DocumentsPort, project: OpenProject): Promise<readonly string[]> => {
  const found: string[] = [];
  for (const folder of project.folders.filter((each) => each.granted)) {
    const stored = project.manifest.folders.find((each) => each.folderId === folder.folderId);
    found.push(...(await scanFolder(documents, folder, stored)));
  }
  return found.sort((left, right) => left.localeCompare(right));
};

export { scanProjectFiles };
