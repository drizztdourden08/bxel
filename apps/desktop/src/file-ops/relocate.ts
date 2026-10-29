/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { OpOutcome, Relocation } from './file-ops.type';
import { relocateWith } from './relocate-with';

const relocate = async (moves: readonly Relocation[]): Promise<OpOutcome> => {
  const kit = fileKit();
  return kit ? relocateWith(kit, moves) : { ok: false, message: FILE_OPS_TEXT.unavailable };
};

export { relocate };
