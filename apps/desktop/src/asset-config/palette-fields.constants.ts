/* @layer renderer-app @kind constants */
import type { PaletteBank } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { ASSET_LABEL } from './asset-config.constants';
import type { AssetFields, AssetFocus, AssetOutcome } from './asset-config.type';
import { focusBank } from './focus-bank';
import { runField } from './run-field';

const bankOf = focusBank;

const updateBank = (focus: AssetFocus, label: string, options: object): AssetOutcome => {
  const bank = bankOf(focus);
  return bank ? runField(focus, label, [{ name: PALETTE_COMMAND_NAME.paletteUpdate, targets: null, options: { bankId: bank.id, ...options } }]) : null;
};

const firstColour = (bank: PaletteBank): string | undefined => bank.slots.find((slot) => slot.kind === 'color')?.id;

const setTransparent = (focus: AssetFocus, value: unknown): AssetOutcome => {
  const bank = bankOf(focus);
  if (!bank || typeof value !== 'boolean' || value === bank.transparent) return null;
  return updateBank(focus, ASSET_LABEL.transparent, value ? { transparent: true } : { transparent: false, replacementId: firstColour(bank) });
};

const PALETTE_FIELDS: AssetFields = {
  'palette.name': {
    read: (focus) => bankOf(focus)?.name ?? '',
    write: (focus, value) => (typeof value === 'string' ? updateBank(focus, ASSET_LABEL.paletteName, { name: value.trim() }) : null),
    buffered: true,
  },
  'palette.transparent': { read: (focus) => bankOf(focus)?.transparent ?? false, write: setTransparent },
};

export { PALETTE_FIELDS };
