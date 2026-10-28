/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import { checkEntryName } from '../project/check-entry-name';
import { fileKit } from '../files/file-kit';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { OpOutcome } from './file-ops.type';
import { relocate } from './relocate';

const renameEntryLinked = async (path: string, typed: string, isFolder: boolean): Promise<OpOutcome> => {
  const kit = fileKit();
  if (!kit) return { ok: false, message: FILE_OPS_TEXT.unavailable };
  const from = toSlashes(path);
  const dir = parentOf(from);
  const old = fileName(from);
  const ending = isFolder || !old.includes('.') ? '' : old.slice(old.lastIndexOf('.'));
  const name = typed.trim().endsWith(ending) && ending !== '' ? typed.trim() : `${typed.trim()}${ending}`;
  if (name === old) return { ok: true, rewritten: 0 };
  const problem = await checkEntryName(kit.documents, dir, name, old);
  if (problem !== null) return { ok: false, message: problem };
  const to = `${dir}/${name}`;
  const outcome = await relocate([{ from, to }]);
  if (outcome.ok) toast(FILE_OPS_TEXT.renamed(name), { variant: 'success', action: { label: FILE_OPS_TEXT.undo, onSelect: () => void relocate([{ from: to, to: from }]) } });
  return outcome;
};

export { renameEntryLinked };
