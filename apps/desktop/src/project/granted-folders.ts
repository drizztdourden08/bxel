/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { ResolvedFolder } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { ProjectFolderState } from './project.type';

const reachable = (documents: DocumentsPort, path: string): Promise<boolean> =>
  documents.list(path).then(
    () => true,
    () => false,
  );

const grantedFolders = (
  documents: DocumentsPort,
  root: string,
  folders: readonly ResolvedFolder[],
): Promise<readonly ProjectFolderState[]> =>
  Promise.all(
    folders.map(async (folder) => ({ ...folder, granted: isSamePath(folder.path, root) || (await reachable(documents, folder.path)) })),
  );

export { grantedFolders };
