/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { useFileStore } from '../stores/useFileStore';
import { failed } from './failed';
import { fileKit } from './file-kit';
import { FILE_TEXT } from './files.constants';
import type { FileOutcome } from './files.type';
import { reasonOf } from './reason-of';
import { reportOutcome } from './report-outcome';
import { saveProject } from './save-project';

const attempt = async (documentId: DocumentId): Promise<FileOutcome> => {
  const kit = fileKit();
  if (!kit) return failed(FILE_TEXT.unavailable);
  kit.focus(documentId);
  try {
    return await saveProject(kit, documentId, false);
  } catch (error) {
    return failed(reasonOf(error));
  }
};

const saveForQuit = async (documentId: DocumentId): Promise<boolean> => {
  const files = useFileStore.getState();
  if (files.busy !== null) {
    toast(FILE_TEXT.busy, { variant: 'info' });
    return false;
  }
  files.setBusy('saving');
  try {
    const outcome = await attempt(documentId);
    reportOutcome(outcome, { kind: 'save' });
    return outcome.kind === 'done';
  } finally {
    files.setBusy(null);
  }
};

export { saveForQuit };
