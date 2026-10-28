/* @layer renderer-app @kind logic */
import { COMMAND_NAME, formatSwatchColor, swatchAlpha } from '@bxel/document';
import type { DocumentId, PaletteBank, Rgb, Swatch } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { RECOLOUR_LABEL, RECOLOUR_TEXT } from './palette-bank.constants';
import type { BankOutcome, RecolourChange } from './palette-bank.type';

const nextName = (slot: Extract<Swatch, { kind: 'color' }>, wanted: string | undefined, text: string): string | undefined => {
  const typed = wanted?.trim() ?? '';
  if (typed !== '' && typed !== slot.name) return typed;
  const automatic = slot.name.toLowerCase() === formatSwatchColor(slot.rgb, slot.alpha).toLowerCase();
  return automatic && text !== slot.name ? text : undefined;
};

const recolourSwatch = (host: DocumentHost, documentId: DocumentId, bank: PaletteBank, change: RecolourChange): BankOutcome => {
  const slot = bank.slots[change.index];
  if (!slot || slot.kind === 'transparent') return { ok: false, message: RECOLOUR_TEXT.fixed };
  const rgb = change.rgb.toLowerCase() as Rgb;
  const alpha = change.alpha ?? swatchAlpha(slot);
  const next = formatSwatchColor(rgb, alpha);
  const name = nextName(slot, change.name, next);
  if (rgb === slot.rgb.toLowerCase() && alpha === swatchAlpha(slot) && name === undefined) return { ok: true, message: RECOLOUR_TEXT.same };
  const options = { bankId: bank.id, swatchId: slot.id, rgb, alpha, ...(name === undefined ? {} : { name }) };
  const done = runSteps(host, documentId, RECOLOUR_LABEL, [{ name: COMMAND_NAME.swatchUpdate, targets: null, options }]);
  return done.ok ? { ok: true, message: RECOLOUR_TEXT.done(change.index, next) } : { ok: false, message: RECOLOUR_TEXT.failed(done.error.message) };
};

export { recolourSwatch };
