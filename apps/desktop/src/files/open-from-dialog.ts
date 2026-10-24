/* @layer renderer-app @kind logic */
import { openPath } from '../workspace/open-path';
import { CANCELLED, FILE_TEXT, OPEN_FILTERS } from './files.constants';
import type { FileKit, FileOutcome } from './files.type';

const openFromDialog = async (kit: FileKit): Promise<FileOutcome> => {
  const path = await kit.documents.open({ title: FILE_TEXT.openTitle, filters: OPEN_FILTERS });
  return path === null ? CANCELLED : openPath(kit, path);
};

export { openFromDialog };
