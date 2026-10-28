/* @layer core @kind logic */
import { swatchAlpha } from '@bxel/document';
import type { PaletteBank, SwatchId } from '@bxel/document';
import type { SwatchFold } from './swatch-removal.type';

const duplicateFolds = (bank: PaletteBank): SwatchFold[] => {
  const first = new Map<string, SwatchId>();
  const folds: SwatchFold[] = [];
  for (const slot of bank.slots) {
    if (slot.kind !== 'color') continue;
    const key = `${slot.rgb.toLowerCase()}/${swatchAlpha(slot)}`;
    const kept = first.get(key);
    if (kept === undefined) first.set(key, slot.id);
    else folds.push({ from: slot.id, into: kept });
  }
  return folds.reverse();
};

export { duplicateFolds };
