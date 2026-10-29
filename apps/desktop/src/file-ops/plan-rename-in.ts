/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { fileName } from '../files/file-name';
import { checkEntryName } from '../project/check-entry-name';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import type { Relocation } from './file-ops.type';

const planRenameIn = async (documents: DocumentsPort, path: string, typed: string, isFolder: boolean): Promise<Relocation | string | null> => {
  const from = toSlashes(path);
  const dir = parentOf(from);
  const old = fileName(from);
  const ending = isFolder || !old.includes('.') ? '' : old.slice(old.lastIndexOf('.'));
  const name = typed.trim().endsWith(ending) && ending !== '' ? typed.trim() : `${typed.trim()}${ending}`;
  if (name === old) return null;
  const problem = await checkEntryName(documents, dir, name, old);
  return problem ?? { from, to: `${dir}/${name}` };
};

export { planRenameIn };
