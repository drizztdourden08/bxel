/* @layer core @kind logic */
import { unzipSync } from 'fflate';
import type { ListedEntry } from './archive.type';

const listEntries = (bytes: Uint8Array): readonly ListedEntry[] => {
  const listed: ListedEntry[] = [];
  unzipSync(bytes, {
    filter: (file) => {
      listed.push({ name: file.name, size: file.originalSize });
      return false;
    },
  });
  return listed;
};

export { listEntries };
