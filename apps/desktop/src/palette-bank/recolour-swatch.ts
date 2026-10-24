/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { DocumentId, PaletteBank } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { RECOLOUR_LABEL, RECOLOUR_TEXT } from './palette-bank.constants';
import type { BankOutcome, RecolourChange } from './palette-bank.type';

const recolourSwatch = (host: DocumentHost, documentId: DocumentId, bank: PaletteBank, change: RecolourChange): BankOutcome => {
  const slot = bank.slots[change.index];
  if (!slot || slot.kind === 'transparent') return { ok: false, message: RECOLOUR_TEXT.fixed };
  const next = change.rgb.toLowerCase();
  if (next === slot.rgb.toLowerCase()) return { ok: true, message: RECOLOUR_TEXT.same };
  const rename = slot.name.toLowerCase() === slot.rgb.toLowerCase();
  const options = { bankId: bank.id, swatchId: slot.id, rgb: next, ...(rename ? { name: next } : {}) };
  const done = runSteps(host, documentId, RECOLOUR_LABEL, [{ name: COMMAND_NAME.swatchUpdate, targets: null, options }]);
  return done.ok ? { ok: true, message: RECOLOUR_TEXT.done(change.index, next) } : { ok: false, message: RECOLOUR_TEXT.failed(done.error.message) };
};

export { recolourSwatch };
