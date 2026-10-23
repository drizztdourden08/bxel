/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useFileStore } from '../stores/useFileStore';
import { failed } from './failed';
import { fileKit } from './file-kit';
import { BUSY_OF, FILE_TEXT } from './files.constants';
import type { FileAction, FileOutcome } from './files.type';
import { performAction } from './perform-action';
import { reasonOf } from './reason-of';
import { reportOutcome } from './report-outcome';

const attempt = async (action: FileAction): Promise<FileOutcome> => {
  const kit = fileKit();
  if (!kit) return failed(FILE_TEXT.unavailable);
  try {
    return await performAction(kit, action, useDocumentStore.getState().activeId);
  } catch (error) {
    return failed(reasonOf(error));
  }
};

const runFileAction = async (action: FileAction): Promise<void> => {
  const files = useFileStore.getState();
  if (files.busy !== null) {
    toast(FILE_TEXT.busy, { variant: 'info' });
    return;
  }
  files.setBusy(BUSY_OF[action.kind]);
  try {
    reportOutcome(await attempt(action), action);
  } finally {
    files.setBusy(null);
  }
};

export { runFileAction };
