/* @layer renderer-app @kind logic */
import type { DocumentEntry, DocumentsPort } from '@drizztdourden08/brock-core';
import { WALK_LIMIT } from './asset-list.constants';

const NONE = { entries: [] as DocumentEntry[], truncated: false };

const walkFolders = async (documents: Pick<DocumentsPort, 'list'>, root: string): Promise<readonly DocumentEntry[]> => {
  const found: DocumentEntry[] = [];
  const queue = [root];
  for (let at = 0; at < queue.length && found.length < WALK_LIMIT; at += 1) {
    const listing = await documents.list(queue[at] ?? root).catch(() => NONE);
    for (const entry of listing.entries) {
      found.push(entry);
      if (entry.kind === 'folder' && !entry.link) queue.push(entry.path);
    }
  }
  return found;
};

const listRootEntries = async (documents: Pick<DocumentsPort, 'list'>, root: string): Promise<readonly DocumentEntry[]> => {
  const listing = await documents.list(root, { recursive: true }).catch(() => NONE);
  return listing.truncated ? walkFolders(documents, root) : listing.entries;
};

export { listRootEntries };
