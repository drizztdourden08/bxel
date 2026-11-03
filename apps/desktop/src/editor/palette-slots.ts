/* @layer renderer-app @kind logic */
import { formatSwatchColor, swatchAlpha } from '@bxel/document';
import type { PaletteBank, Swatch } from '@bxel/document';
import type { PaletteSlot } from './palette-slots.type';
import { PALETTE_TEXT } from './palette-text.constants';

const rampNameOf = (bank: PaletteBank, swatch: Swatch): string | undefined => bank.ramps.find((ramp) => ramp.swatches.includes(swatch.id))?.name;

const slotOf = (swatch: Swatch, index: number, ramp: string | undefined): PaletteSlot => {
  if (swatch.kind === 'transparent') {
    const name = PALETTE_TEXT.transparentName;
    return { index, hex: '', name, transparent: true, alpha: 0, label: PALETTE_TEXT.swatch(index, name, '') };
  }
  const hex = formatSwatchColor(swatch.rgb, swatch.alpha).toUpperCase();
  return { index, hex, name: swatch.name, transparent: false, alpha: swatchAlpha(swatch), label: PALETTE_TEXT.swatch(index, swatch.name.toLowerCase(), hex), ...(ramp === undefined ? {} : { ramp }) };
};

const paletteSlots = (bank: PaletteBank): PaletteSlot[] => bank.slots.map((swatch, index) => slotOf(swatch, index, rampNameOf(bank, swatch)));

export { paletteSlots };
