/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { exportPng } from './export-png';
import { failed } from './failed';
import { FILE_TEXT } from './files.constants';
import type { FileAction, FileKit, FileOutcome } from './files.type';
import { openFromDialog } from './open-from-dialog';
import { openArtwork } from './open-artwork';
import { saveArtwork } from './save-artwork';

const performAction = (kit: FileKit, action: FileAction, documentId: DocumentId | null): Promise<FileOutcome> => {
  if (action.kind === 'open') return openFromDialog(kit);
  if (action.kind === 'openPath') return openArtwork(kit, action.path);
  if (documentId === null) return Promise.resolve(failed(FILE_TEXT.noDocument));
  if (action.kind === 'export') return exportPng(kit, documentId);
  return saveArtwork(kit, documentId, action.kind === 'saveAs');
};

export { performAction };
