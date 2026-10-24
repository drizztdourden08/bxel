/* @layer renderer-app @kind logic */
import { listEntries } from '@bxel/project';
import type { Listing, ListOptions } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';

const listFolderEntries = async (documents: DocumentsPort, folder: string, options: ListOptions): Promise<Listing & { readonly cut: boolean }> => {
  const found = await documents.list(folder);
  const raw = found.entries.map(({ name, kind, size, modified }) => ({ name, kind, size, modified }));
  return { ...listEntries(raw, options), cut: found.truncated };
};

export { listFolderEntries };
