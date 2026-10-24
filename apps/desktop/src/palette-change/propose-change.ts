/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { CHANGE_TEXT } from './palette-change.constants';
import type { ChangeKind, ProposeResult, ToolColours } from './palette-change.type';

const mergeTarget = (bank: PaletteBank, colours: ToolColours): number | null => {
  const usable = (index: number): boolean => index !== colours.foreground && index >= 0 && index < bank.slots.length;
  if (usable(colours.background)) return colours.background;
  const found = bank.slots.findIndex((_, index) => usable(index));
  return found < 0 ? null : found;
};

const proposeChange = (kind: ChangeKind, view: DocumentView | null, colours: ToolColours): ProposeResult => {
  if (!view) return { ok: false, message: CHANGE_TEXT.noFile };
  const { artwork, documentId } = view.state;
  const bank = findBank(artwork, artwork.sprites[0]?.bankId ?? artwork.defaultBankId);
  if (!bank) return { ok: false, message: CHANGE_TEXT.noFile };
  const swatch = kind === 'limit' ? 0 : colours.foreground;
  if (kind !== 'limit' && (swatch <= 0 || swatch >= bank.slots.length)) return { ok: false, message: CHANGE_TEXT.fixedSlot };
  const other = kind === 'merge' ? mergeTarget(bank, colours) : null;
  return { ok: true, request: { kind, documentId, bankId: bank.id, swatch, other, cap: bank.cap } };
};

export { proposeChange };
