/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useImportStore } from '../stores/useImportStore';
import { focusDocument } from '../transactions/focus-document';
import { IMPORT_TEXT } from './image-import.constants';
import type { ImportRun } from './image-import.type';
import { runImport } from './run-import';

const finishImport = (run: ImportRun): string | null => {
  const outcome = runImport(useDocumentStore.getState().host, run);
  if (!outcome.ok) return IMPORT_TEXT.failed(outcome.message);
  if (run.form.target === 'new') focusDocument(outcome.documentId);
  toast(IMPORT_TEXT.imported(outcome.names), { variant: 'success' });
  useImportStore.getState().hide();
  return null;
};

export { finishImport };
