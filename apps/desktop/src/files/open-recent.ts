/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { FILE_TEXT } from './files.constants';
import { reasonOf } from './reason-of';
import { runFileAction } from './run-file-action';

const openRecent = async (reopen: (path: string) => Promise<string | null>, path: string): Promise<void> => {
  try {
    const full = await reopen(path);
    if (full === null) toast(FILE_TEXT.recentMissing, { variant: 'warning' });
    else await runFileAction({ kind: 'openPath', path: full });
  } catch (error) {
    toast(reasonOf(error), { variant: 'danger' });
  }
};

export { openRecent };
