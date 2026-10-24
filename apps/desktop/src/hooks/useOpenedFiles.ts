/* @layer renderer-app @kind hook */
import { toast, useAppOpen } from '@drizztdourden08/brock-react';
import { BXEL_EXTENSIONS } from '../files/files.constants';
import { runFileAction } from '../files/run-file-action';
import { WORKSPACE_TEXT } from '../workspace/workspace.constants';

const useOpenedFiles = (): void =>
  useAppOpen((request) => {
    if (request.kind !== 'file') return;
    if (BXEL_EXTENSIONS.includes(request.ext.toLowerCase())) void runFileAction({ kind: 'openPath', path: request.path });
    else toast(WORKSPACE_TEXT.notNative, { variant: 'warning' });
  });

export { useOpenedFiles };
