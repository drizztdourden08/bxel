/* @layer renderer-app @kind logic */
import type { PaletteBank, Rgb } from '@bxel/document';
import type { SwatchDraftPreview } from '../stores/palette-panel-store.type';

const draftBank = (bank: PaletteBank, draft: SwatchDraftPreview): PaletteBank => ({
  ...bank,
  slots: bank.slots.map((slot, index) =>
    index === draft.index && slot.kind === 'color' ? { ...slot, rgb: draft.rgb.toLowerCase() as Rgb, alpha: draft.alpha } : slot,
  ),
});

export { draftBank };
