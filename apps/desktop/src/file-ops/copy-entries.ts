/* @layer renderer-app @kind logic */
import { announce, toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { copyEntriesWith } from './copy-entries-with';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { CopyOutcome } from './file-ops.type';

const copyEntries = async (paths: readonly string[], toFolder: string): Promise<CopyOutcome> => {
  const kit = fileKit();
  const outcome: CopyOutcome = kit ? await copyEntriesWith(kit.documents, paths, toFolder) : { ok: false, message: FILE_OPS_TEXT.unavailable };
  if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
  else {
    const said = FILE_OPS_TEXT.copied(outcome.copied);
    toast(said, { variant: 'success' });
    announce(said);
  }
  return outcome;
};

export { copyEntries };
