/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toSlashes } from './to-slashes';

const takenIn = async (documents: DocumentsPort, dir: string): Promise<Set<string>> => {
  const listing = await documents.list(dir).catch(() => ({ entries: [] }));
  return new Set(listing.entries.map((entry) => toSlashes(entry.path).toLowerCase()));
};

export { takenIn };
