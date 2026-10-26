/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { fileName } from '../files/file-name';
import { parentOf } from '../workspace/parent-of';
import type { FileStat } from './asset-overview.type';

const statFile = async (documents: DocumentsPort, path: string): Promise<FileStat | null> => {
  const listing = await documents.list(parentOf(path)).catch(() => null);
  const name = fileName(path).toLowerCase();
  const entry = listing?.entries.find((each) => each.kind === 'file' && each.name.toLowerCase() === name);
  return entry ? { size: entry.size, modified: entry.modified } : null;
};

export { statFile };
