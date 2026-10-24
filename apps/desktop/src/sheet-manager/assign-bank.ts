/* @layer renderer-app @kind logic */
import type { BankId, SpriteId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { BANK_PICK_TEXT } from './bank-text.constants';
import { spriteSteps } from './sprite-steps';

const assignBank = (ids: readonly SpriteId[], bankId: BankId): boolean => {
  const sprites = currentArtwork()?.sprites ?? [];
  const movers = ids.filter((id) => sprites.some((sprite) => sprite.id === id && sprite.bankId !== bankId));
  if (movers.length === 0) return false;
  const steps = spriteSteps(PALETTE_COMMAND_NAME.paletteAssign, movers, { bankId, mapping: [] });
  return runDocument(BANK_PICK_TEXT.label(movers.length), steps) !== null;
};

export { assignBank };
