/* @layer renderer-app @kind logic */
import { FILE_TEXT } from './files.constants';
import type { FileBusy } from './files.type';

const saveLabel = (busy: FileBusy | null, upToDate: boolean): string => {
  if (busy === 'saving') return FILE_TEXT.saveBusy;
  return upToDate ? FILE_TEXT.saveClean : FILE_TEXT.saveReady;
};

export { saveLabel };
