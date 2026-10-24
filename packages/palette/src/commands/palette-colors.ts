/* @layer core @kind logic */
import type { PaletteBank } from '@bxel/document';

const paletteColors = (bank: PaletteBank): string[] => bank.slots.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : []));

export { paletteColors };
