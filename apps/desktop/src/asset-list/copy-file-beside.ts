/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { baseName } from '../files/base-name';
import { fileExtension } from '../files/file-extension';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { uniquePath } from '../workspace/unique-path';
import { copyName } from './copy-name';

const copyFileBeside = async (documents: DocumentsPort, path: string): Promise<string> => {
  const dir = parentOf(path);
  const listing = await documents.list(dir);
  const taken = new Set(listing.entries.map((entry) => toSlashes(entry.path).toLowerCase()));
  const target = uniquePath(dir, copyName([], baseName(path)), `.${fileExtension(path)}`, taken);
  await documents.copy(path, target);
  return target;
};

export { copyFileBeside };
