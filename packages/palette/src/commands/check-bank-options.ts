/* @layer core @kind logic */
import { checkName, ERROR_CODE, fail, MAX_BANK_CAP, MIN_BANK_CAP } from '@bxel/document';
import type { Rgb } from '@bxel/document';
import { checkColor } from './check-color';
import type { PaletteCreateOptions } from './palette-create.type';

type CheckedBank = { readonly name: string; readonly colors: readonly Rgb[] };

const checkBankOptions = (options: PaletteCreateOptions): CheckedBank => {
  const name = checkName(options.name);
  if (options.cap < MIN_BANK_CAP || options.cap > MAX_BANK_CAP) {
    throw fail(ERROR_CODE.CAP_OUT_OF_RANGE, `A bank holds ${MIN_BANK_CAP} to ${MAX_BANK_CAP} slots.`, { path: 'options.cap' });
  }
  const colors = options.colors.map((value, index) => checkColor(value, `options.colors.${index}`));
  const slots = colors.length + (options.transparent ? 1 : 0);
  if (slots === 0) throw fail(ERROR_CODE.INVALID_COLOR, 'An opaque bank needs a Background colour.', { path: 'options.colors' });
  if (slots > options.cap) {
    throw fail(ERROR_CODE.PALETTE_FULL, `${slots} slots do not fit a cap of ${options.cap}.`, { path: 'options.colors' });
  }
  return { name, colors };
};

export { checkBankOptions };
