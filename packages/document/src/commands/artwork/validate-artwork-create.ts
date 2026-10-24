/* @layer core @kind logic */
import { MAX_BANK_CAP, MIN_BANK_CAP } from '../../model/limits.constants';
import { RGB_PATTERN } from '../../model/transparent.constants';
import type { ArtworkCreateOptions } from '../../schema/command-options.type';
import { checkName } from '../../validate/check-name';
import { checkSize } from '../../validate/check-size';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const validateBank = (bank: ArtworkCreateOptions['bank']): void => {
  checkName(bank.name);
  if (bank.cap < MIN_BANK_CAP || bank.cap > MAX_BANK_CAP) {
    throw fail(ERROR_CODE.CAP_OUT_OF_RANGE, `A bank holds ${MIN_BANK_CAP} to ${MAX_BANK_CAP} slots.`, { path: 'options.bank.cap' });
  }
  for (const color of bank.colors) {
    if (!RGB_PATTERN.test(color.rgb)) {
      throw fail(ERROR_CODE.INVALID_COLOR, `"${color.rgb}" is not a #rrggbb colour.`, { path: 'options.bank.colors' });
    }
    if (color.name !== undefined) checkName(color.name);
  }
  const slots = bank.colors.length + (bank.transparent ? 1 : 0);
  if (slots === 0) throw fail(ERROR_CODE.INVALID_COLOR, 'An opaque bank needs a Background colour.', { path: 'options.bank.colors' });
  if (slots > bank.cap) {
    throw fail(ERROR_CODE.PALETTE_FULL, `${slots} slots do not fit a cap of ${bank.cap}.`, { path: 'options.bank.colors' });
  }
};

const validateArtworkCreate = (options: ArtworkCreateOptions): void => {
  checkName(options.name);
  validateBank(options.bank);
  if (options.sprite) {
    checkName(options.sprite.name);
    checkSize(options.sprite);
  }
};

export { validateArtworkCreate };
