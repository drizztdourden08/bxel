/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, BankId } from '@bxel/document';
import type { OverviewPreview } from './asset-overview.type';

const palettePreviewColours = (artwork: Artwork, id: string): OverviewPreview => {
  const bank = findBank(artwork, id as BankId);
  if (!bank) return { kind: 'none' };
  const colours = bank.slots.map((slot) =>
    slot.kind === 'color'
      ? { id: slot.id, rgb: slot.rgb, name: slot.name, transparent: false }
      : { id: slot.id, rgb: '', name: '', transparent: true },
  );
  return { kind: 'swatches', colours };
};

export { palettePreviewColours };
