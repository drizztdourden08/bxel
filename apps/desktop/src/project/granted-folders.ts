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

const regranted = (documents: DocumentsPort, path: string): Promise<boolean> =>
  documents.regrant(path).then(
    () => reachable(documents, path),
    () => false,
  );

const reach = async (documents: DocumentsPort, path: string): Promise<boolean> =>
  (await reachable(documents, path)) || (await regranted(documents, path));

const grantedFolders = (
  documents: DocumentsPort,
  root: string,
  folders: readonly ResolvedFolder[],
): Promise<readonly ProjectFolderState[]> =>
  Promise.all(folders.map(async (folder) => ({ ...folder, granted: isSamePath(folder.path, root) || (await reach(documents, folder.path)) })));

export { grantedFolders };
