/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { toSlashes } from '../workspace/to-slashes';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { FolderOutcome } from './file-ops.type';

const freeName = (taken: ReadonlySet<string>, base: string): string => {
  if (!taken.has(base.toLowerCase())) return base;
  let at = 2;
  while (taken.has(`${base} ${at}`.toLowerCase())) at += 1;
  return `${base} ${at}`;
};

const makeFolder = async (inside: string): Promise<FolderOutcome> => {
  const kit = fileKit();
  if (!kit) return { ok: false, message: FILE_OPS_TEXT.unavailable };
  try {
    const dir = toSlashes(inside).replace(/\/$/, '');
    const taken = new Set((await kit.documents.list(dir)).entries.map((entry) => entry.name.toLowerCase()));
    const path = `${dir}/${freeName(taken, FILE_OPS_TEXT.newFolder)}`;
    await kit.documents.mkdir(path);
    return { ok: true, path };
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
};

export { makeFolder };
