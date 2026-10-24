/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { openPath } from '../workspace/open-path';
import { saveActiveAsset } from '../workspace/save-active-asset';
import { saveWorkspace } from '../workspace/save-workspace';
import { failed } from './failed';
import { FILE_TEXT } from './files.constants';
import type { FileAction, FileKit, FileOutcome } from './files.type';
import { openFromDialog } from './open-from-dialog';

const performAction = (kit: FileKit, action: FileAction, documentId: DocumentId | null): Promise<FileOutcome> => {
  if (action.kind === 'open') return openFromDialog(kit);
  if (action.kind === 'openPath') return openPath(kit, action.path);
  if (documentId === null) return Promise.resolve(failed(FILE_TEXT.noDocument));
  if (action.kind === 'saveAll') return saveWorkspace(kit, documentId);
  return saveActiveAsset(kit, action.kind === 'saveAs');
};

export { performAction };
