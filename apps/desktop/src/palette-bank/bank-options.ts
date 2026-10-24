/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { BANK_TEXT } from './palette-bank.constants';
import type { BankOption } from './palette-bank.type';

const bankOptions = (artwork: Artwork): BankOption[] =>
  artwork.banks.map((bank) => ({
    value: bank.id,
    label: BANK_TEXT.slots(bank.name, bank.slots.filter((slot) => slot.kind === 'color').length),
  }));

export { bankOptions };
