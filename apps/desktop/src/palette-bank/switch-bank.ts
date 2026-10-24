/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { BankId, DocumentId, SpriteId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { BANK_LABEL, BANK_TEXT } from './palette-bank.constants';
import type { BankOutcome } from './palette-bank.type';
import { slotPairs } from './slot-pairs';

const switchBank = (host: DocumentHost, documentId: DocumentId, spriteId: SpriteId, bankId: BankId): BankOutcome => {
  const artwork = host.view(documentId)?.state.artwork;
  const sprite = artwork?.sprites.find((each) => each.id === spriteId);
  const source = artwork && sprite ? findBank(artwork, sprite.bankId) : undefined;
  const dest = artwork ? findBank(artwork, bankId) : undefined;
  if (!sprite || !source || !dest) return { ok: false, message: BANK_TEXT.missing };
  const targets = { sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } } as const;
  const options = { bankId, mapping: slotPairs(source, dest) };
  const done = runSteps(host, documentId, BANK_LABEL, [{ name: PALETTE_COMMAND_NAME.paletteAssign, targets, options }]);
  return done.ok ? { ok: true, message: BANK_TEXT.done(sprite.name, dest.name) } : { ok: false, message: BANK_TEXT.failed(done.error.message) };
};

export { switchBank };
