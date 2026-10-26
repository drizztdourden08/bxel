/* @layer renderer-app @kind logic */
import { SHEET_IMPORT_REF } from '@bxel/palette';
import { toast } from '@drizztdourden08/brock-react';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useImportStore } from '../stores/useImportStore';
import { showImportedMap } from '../tiled-import/show-imported-map';
import { TILED_TEXT } from '../tiled-import/tiled-import.constants';
import { focusDocument } from '../transactions/focus-document';
import { focusTab } from '../workspace/focus-tab';
import { tabOf } from '../workspace/tab-of';
import { ANIMATION_REF, IMPORT_TEXT } from './image-import.constants';
import type { ImportRun } from './image-import.type';
import { runImport } from './run-import';

const messageOf = (run: ImportRun, names: readonly string[]): string => {
  if (run.tiled) return TILED_TEXT.imported(run.form.name.trim(), run.tiled.plan.tiles.length);
  if (run.form.kind === 'animation' || run.form.kind === 'strip') {
    return IMPORT_TEXT.importedAnimation(run.form.name.trim(), run.form.kind === 'strip' ? run.rects.length : (run.image.frames?.length ?? 1));
  }
  return IMPORT_TEXT.imported(names);
};

const finishImport = (run: ImportRun): string | null => {
  const outcome = runImport(useDocumentStore.getState().host, run);
  if (!outcome.ok) return IMPORT_TEXT.failed(outcome.message);
  if (run.form.target === 'new') focusDocument(outcome.documentId);
  const sheet = outcome.created[SHEET_IMPORT_REF];
  if (run.form.kind === 'sheet' && sheet !== undefined) focusTab(tabOf(outcome.documentId, { kind: 'sheet', id: sheet }));
  const animation = outcome.created[ANIMATION_REF];
  if (animation !== undefined) focusTab(tabOf(outcome.documentId, { kind: 'animation', id: animation }));
  if (run.form.kind === 'tiled') showImportedMap(outcome.created);
  const message = messageOf(run, outcome.names);
  toast(message, { variant: 'success' });
  useImportStore.getState().hide();
  return null;
};

export { finishImport };
