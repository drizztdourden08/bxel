/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { fileName } from '../../files/file-name';
import { parentOf } from '../../workspace/parent-of';

/** Whether a path is a file or a folder on disk, or nothing. */
const entryKindAt = async (documents: DocumentsPort, path: string): Promise<'file' | 'folder' | null> => {
  const listing = await documents.list(parentOf(path)).catch(() => null);
  const name = fileName(path).toLowerCase();
  return listing?.entries.find((entry) => entry.name.toLowerCase() === name)?.kind ?? null;
};

export { entryKindAt };
