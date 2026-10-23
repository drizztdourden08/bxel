/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import { isPermutation } from '../is-permutation';

const checkOrder = (bank: PaletteBank, order: readonly string[]): number[] => {
  const position = new Map(bank.slots.map((slot, index) => [String(slot.id), index] as const));
  const indices = order.map((id) => position.get(id) ?? -1);
  if (order.length !== bank.slots.length || !isPermutation(indices)) {
    throw fail(ERROR_CODE.INVALID_PERMUTATION, 'order must list every swatch of the bank exactly once.', { path: 'options.order' });
  }
  if (indices[0] === 0) return indices;
  if (bank.transparent) {
    throw fail(ERROR_CODE.TRANSPARENT_SLOT_FIXED, 'The transparent swatch stays in slot 0.', { path: 'options.order' });
  }
  throw fail(ERROR_CODE.INVALID_PERMUTATION, 'The Background swatch stays in slot 0 of an opaque bank.', { path: 'options.order' });
};

export { checkOrder };
