/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank } from '@bxel/document';
import { PALETTE_TEXT } from '../editor/palette-text.constants';
import { limitError } from '../palette-limit/limit-error';
import { CHANGE_TEXT } from './palette-change.constants';
import type { ChangePreview, ChangeRequest } from './palette-change.type';

const limitIssue = (bank: PaletteBank, cap: number): string | null => {
  const range = limitError(cap);
  if (range !== null) return range;
  if (cap < bank.slots.length) return CHANGE_TEXT.below(bank.slots.length);
  return cap === bank.cap ? CHANGE_TEXT.same(cap) : null;
};

const limitPreview = (artwork: Artwork, bank: PaletteBank, request: ChangeRequest): ChangePreview => ({
  swatchLine: '',
  bankName: bank.name,
  affected: [],
  totalSprites: artwork.sprites.length,
  pixels: 0,
  picture: null,
  countBefore: PALETTE_TEXT.count(bank.cap, bank.transparent),
  countAfter: PALETTE_TEXT.count(request.cap, bank.transparent),
  error: limitIssue(bank, request.cap),
});

export { limitPreview };
