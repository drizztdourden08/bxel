/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toSlashes } from '../workspace/to-slashes';
import { uniquePath } from '../workspace/unique-path';
import type { DropResult } from './file-ops.type';

const splitName = (name: string): { readonly stem: string; readonly extension: string } => {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? { stem: name.slice(0, dot), extension: name.slice(dot) } : { stem: name, extension: '' };
};

const writeDropped = async (documents: DocumentsPort, folder: string, files: readonly File[]): Promise<DropResult> => {
  const target = toSlashes(folder).replace(/\/$/, '');
  const listing = await documents.list(target).catch(() => null);
  if (listing === null) return { written: [], failed: files.map((file) => file.name) };
  const taken = new Set(listing.entries.map((entry) => toSlashes(entry.path).toLowerCase()));
  const written: string[] = [];
  const failed: string[] = [];
  for (const file of files) {
    const { stem, extension } = splitName(file.name);
    const path = uniquePath(target, stem, extension, taken);
    try {
      await documents.write(path, new Uint8Array(await file.arrayBuffer()), { recent: false });
      taken.add(path.toLowerCase());
      written.push(path);
    } catch {
      failed.push(file.name);
    }
  }
  return { written, failed };
};

export { writeDropped };
