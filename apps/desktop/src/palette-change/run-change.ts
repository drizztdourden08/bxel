/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { TransactionMode } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { changeSteps } from './change-steps';
import { CHANGE_LABEL, CHANGE_TEXT } from './palette-change.constants';
import type { ChangeOutcome, ChangeRequest } from './palette-change.type';

const runChange = (host: DocumentHost, request: ChangeRequest, mode: TransactionMode): ChangeOutcome => {
  const view = host.view(request.documentId);
  const bank = view ? findBank(view.state.artwork, request.bankId) : undefined;
  if (!view || !bank) return { ok: false, message: CHANGE_TEXT.noFile };
  const result = host.execute({
    documentId: request.documentId,
    baseRevision: view.state.revision,
    mode,
    origin: 'ui',
    label: CHANGE_LABEL[request.kind],
    steps: changeSteps(bank, request),
    previewPixels: 0,
  });
  return result.ok ? { ok: true } : { ok: false, message: result.error.message };
};

export { runChange };
