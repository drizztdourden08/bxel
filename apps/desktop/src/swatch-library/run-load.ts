/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { loadMessage } from './load-message';
import { loadPlan } from './load-plan';
import { LIBRARY_LABEL, LIBRARY_TEXT } from './swatch-library.constants';
import type { LoadOutcome, LoadRequest } from './swatch-library.type';

const runLoad = (host: DocumentHost, request: LoadRequest): LoadOutcome => {
  const { documentId, bankId, set, mode } = request;
  const view = host.view(documentId);
  const bank = view ? findBank(view.state.artwork, bankId) : undefined;
  if (!bank) return { ok: false, message: LIBRARY_TEXT.noFile };
  const plan = loadPlan(bank, set.colors, mode);
  if (plan.colors.length === 0) return { ok: false, message: plan.dropped > 0 ? LIBRARY_TEXT.full(bank.cap) : LIBRARY_TEXT.nothing };
  const options = { bankId, colors: plan.colors, mode: plan.mode };
  const steps = [{ name: PALETTE_COMMAND_NAME.paletteImport, targets: null, options }];
  const done = runSteps(host, documentId, LIBRARY_LABEL[mode], steps);
  return done.ok ? { ok: true, message: loadMessage(plan, bank.cap) } : { ok: false, message: LIBRARY_TEXT.failed(done.error.message) };
};

export { runLoad };
