/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { CHANGE_TEXT } from './palette-change.constants';
import type { ChangeRequest } from './palette-change.type';

const swatchIssue = (bank: PaletteBank, request: ChangeRequest, pixels: number): string | null => {
  if (request.swatch <= 0 || request.swatch >= bank.slots.length) return CHANGE_TEXT.fixedSlot;
  if (bank.slots.length < 2) return CHANGE_TEXT.noOther;
  const { other } = request;
  const needed = request.kind === 'merge' || pixels > 0;
  if (other === null) return needed ? CHANGE_TEXT.chooseOther : null;
  return other === request.swatch || other < 0 || other >= bank.slots.length ? CHANGE_TEXT.chooseOther : null;
};

export { swatchIssue };
