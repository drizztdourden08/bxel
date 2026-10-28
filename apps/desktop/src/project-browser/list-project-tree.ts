/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { ListedFile } from '../asset-list/asset-list.type';
import { toSlashes } from '../workspace/to-slashes';
import type { ProjectTree } from './project-browser.type';

/** Every file and every folder under the granted roots, so empty folders show too. */
const listProjectTree = async (documents: DocumentsPort, roots: readonly string[]): Promise<ProjectTree> => {
  const files: ListedFile[] = [];
  const folders: string[] = [];
  for (const root of roots) {
    const listing = await documents.list(root, { recursive: true }).catch(() => ({ entries: [] }));
    for (const entry of listing.entries) {
      if (entry.kind === 'file') files.push({ path: toSlashes(entry.path), name: entry.name, modified: entry.modified, size: entry.size });
      else folders.push(toSlashes(entry.path));
    }
  }
  return { files, folders };
};

export { listProjectTree };
