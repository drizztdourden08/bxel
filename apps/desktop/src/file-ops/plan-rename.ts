/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { fileName } from '../files/file-name';
import { checkEntryName } from '../project/check-entry-name';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { Relocation } from './file-ops.type';

const planRename = async (path: string, typed: string, isFolder: boolean): Promise<Relocation | string | null> => {
  const kit = fileKit();
  if (!kit) return FILE_OPS_TEXT.unavailable;
  const from = toSlashes(path);
  const dir = parentOf(from);
  const old = fileName(from);
  const ending = isFolder || !old.includes('.') ? '' : old.slice(old.lastIndexOf('.'));
  const name = typed.trim().endsWith(ending) && ending !== '' ? typed.trim() : `${typed.trim()}${ending}`;
  if (name === old) return null;
  const problem = await checkEntryName(kit.documents, dir, name, old);
  return problem ?? { from, to: `${dir}/${name}` };
};

export { planRename };
