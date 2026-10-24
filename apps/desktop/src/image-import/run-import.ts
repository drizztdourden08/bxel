/* @layer renderer-app @kind logic */
import { MAX_NAME_LENGTH } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { baseName } from '../files/base-name';
import { NEW_FILE_NAME, NEW_TEXT } from '../new-sprite/new-sprite.constants';
import { TILED_LABEL } from '../tiled-import/tiled-import.constants';
import { runSteps } from '../transactions/run-steps';
import { IMPORT_LABEL } from './image-import.constants';
import type { ImportOutcome, ImportRun } from './image-import.type';
import { importSteps } from './import-steps';

const labelOf = (run: ImportRun): string => {
  if (run.form.kind === 'tiled') return TILED_LABEL;
  return run.names.length === 1 ? IMPORT_LABEL.sprite : IMPORT_LABEL.sprites(run.names.length);
};

const importIntoFile = (host: DocumentHost, run: ImportRun): ImportOutcome => {
  const documentId = run.context.documentId;
  if (documentId === null) return { ok: false, message: NEW_TEXT.noFile };
  const done = runSteps(host, documentId, labelOf(run), importSteps(run, null));
  return done.ok ? { ok: true, documentId, names: run.names, created: done.created } : { ok: false, message: done.error.message };
};

const importIntoNew = (host: DocumentHost, run: ImportRun): ImportOutcome => {
  const draft = run.plan.bank;
  if (!draft) return { ok: false, message: NEW_TEXT.noFile };
  const title = baseName(run.image.fileName).slice(0, MAX_NAME_LENGTH).trim();
  const created = host.create({
    name: title === '' ? NEW_FILE_NAME : title,
    bank: { name: draft.name, cap: draft.cap, transparent: draft.transparent, colors: draft.colors },
  });
  if (!created.ok) return { ok: false, message: created.error.message };
  const documentId: DocumentId = created.documentId;
  const bankId = host.view(documentId)?.state.artwork.defaultBankId ?? null;
  const done = runSteps(host, documentId, labelOf(run), importSteps(run, bankId));
  if (done.ok) return { ok: true, documentId, names: run.names, created: done.created };
  host.close(documentId);
  return { ok: false, message: done.error.message };
};

const runImport = (host: DocumentHost, run: ImportRun): ImportOutcome =>
  run.form.target === 'file' ? importIntoFile(host, run) : importIntoNew(host, run);

export { runImport };
