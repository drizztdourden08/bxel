/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { Draft, PaletteBank, SwatchColorValue } from '@bxel/document';
import { colorDistance } from '../color-distance';
import { parseHex } from '../parse-hex';
import { REMAP_SIZE } from '../remap-size.constants';
import { bankSprites } from './bank-sprites';
import { importReplace } from './import-replace';
import { remapSprites } from './remap-sprites';

const rgbOf = (value: string): number => parseHex(value.slice(0, 7)) ?? 0;

const nearestSlot = (rgb: number, colors: readonly SwatchColorValue[]): number => {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const [slot, color] of colors.entries()) {
    const distance = colorDistance(rgb, rgbOf(color.rgb));
    if (distance < bestDistance) {
      best = slot;
      bestDistance = distance;
    }
  }
  return best;
};

/** Every used colour of the bank moves to the nearest colour of the new list, then the list replaces the bank colours. */
const importMap = (draft: Draft, bank: PaletteBank, colors: readonly SwatchColorValue[]): void => {
  const floor = bank.transparent ? 1 : 0;
  if (colors.length === 0 || floor + colors.length > bank.cap) {
    throw fail(ERROR_CODE.PALETTE_FULL, `${colors.length} colours do not fit a cap of ${bank.cap}.`, { path: 'options.colors' });
  }
  const table = new Uint8Array(REMAP_SIZE);
  for (const [slot, swatch] of bank.slots.entries()) {
    table[slot] = slot < floor || swatch.kind !== 'color' ? slot : floor + nearestSlot(rgbOf(swatch.rgb), colors);
  }
  remapSprites(draft, bankSprites(draft.artwork, bank.id).map((sprite) => sprite.id), table);
  importReplace(draft, bank, colors);
};

export { importMap };
