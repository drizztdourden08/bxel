/* @layer renderer-app @kind hook */
import { toast, useAppOpen } from '@drizztdourden08/brock-react';
import { BXEL_EXTENSION, FILE_TEXT } from '../files/files.constants';
import { runFileAction } from '../files/run-file-action';

const useOpenedFiles = (): void =>
  useAppOpen((request) => {
    if (request.kind !== 'file') return;
    if (request.ext.toLowerCase() === BXEL_EXTENSION) void runFileAction({ kind: 'openPath', path: request.path });
    else toast(FILE_TEXT.notBxel, { variant: 'warning' });
  });

export { useOpenedFiles };
