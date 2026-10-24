/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { OpenProject } from '../project/project.type';
import { toSlashes } from '../workspace/to-slashes';
import type { ListedFile } from './asset-list.type';

const listProjectFiles = async (documents: DocumentsPort, project: OpenProject): Promise<readonly ListedFile[]> => {
  const found: ListedFile[] = [];
  for (const folder of project.folders.filter((each) => each.granted)) {
    const listing = await documents.list(folder.path, { recursive: true }).catch(() => ({ entries: [] }));
    for (const entry of listing.entries) {
      if (entry.kind === 'file') found.push({ path: toSlashes(entry.path), name: entry.name, modified: entry.modified, size: entry.size });
    }
  }
  return found;
};

export { listProjectFiles };
