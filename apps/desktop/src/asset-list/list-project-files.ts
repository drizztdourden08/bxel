/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { OpenProject } from '../project/project.type';
import { toSlashes } from '../workspace/to-slashes';
import type { ListedFile } from './asset-list.type';
import { listRootEntries } from './list-root-entries';

const listProjectFiles = async (documents: DocumentsPort, project: Pick<OpenProject, 'folders'>): Promise<readonly ListedFile[]> => {
  const found: ListedFile[] = [];
  for (const folder of project.folders.filter((each) => each.granted)) {
    for (const entry of await listRootEntries(documents, folder.path)) {
      if (entry.kind === 'file') found.push({ path: toSlashes(entry.path), name: entry.name, modified: entry.modified, size: entry.size });
    }
  }
  return found;
};

export { listProjectFiles };
