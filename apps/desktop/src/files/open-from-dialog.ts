/* @layer renderer-app @kind logic */
import { GRANT_LEVELS } from '../workspace/workspace.constants';
import { openPath } from '../workspace/open-path';
import { CANCELLED, FILE_TEXT, OPEN_FILTERS } from './files.constants';
import type { FileKit, FileOutcome } from './files.type';

const openFromDialog = async (kit: FileKit): Promise<FileOutcome> => {
  const picked = await kit.documents.open({ title: FILE_TEXT.openTitle, filters: OPEN_FILTERS, grantFolder: { ask: true, levels: GRANT_LEVELS } });
  return picked === null ? CANCELLED : openPath(kit, picked.path);
};

export { openFromDialog };
