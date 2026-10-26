/* @layer core @kind logic */
import { formatSwatchColor } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';

const paletteColors = (bank: PaletteBank): string[] =>
  bank.slots.flatMap((slot) => (slot.kind === 'color' ? [formatSwatchColor(slot.rgb, slot.alpha)] : []));

export { paletteColors };
