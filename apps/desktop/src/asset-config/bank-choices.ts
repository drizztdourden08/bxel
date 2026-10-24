/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { bankOptions } from '../palette-bank/bank-options';
import type { BankOption } from '../palette-bank/palette-bank.type';
import { ASSET_TEXT } from './asset-config.constants';

const bankChoices = (artwork: Artwork, paths: ReadonlyMap<string, string>): BankOption[] =>
  bankOptions(artwork).map((option) => (paths.has(option.value) ? { value: option.value, label: ASSET_TEXT.projectPalette(option.label) } : option));

export { bankChoices };
