/* @layer core @kind logic */
import type { PaletteBank, Swatch } from '@bxel/document';
import { mapToPalette } from '../map-to-palette';
import { parseHex } from '../parse-hex';
import { REMAP_SIZE } from '../remap-size.constants';

const colorOf = (slot: Swatch): number => (slot.kind === 'color' ? (parseHex(slot.rgb) ?? 0) : 0);

const nearestTable = (source: PaletteBank, dest: PaletteBank): Uint8Array => {
  const table = new Uint8Array(REMAP_SIZE);
  const palette = dest.slots.slice(1).map((slot) => (slot.kind === 'color' ? slot.rgb : '#000000'));
  if (palette.length === 0) return table;
  const data = new Uint8ClampedArray(source.slots.length * 4);
  for (const [at, slot] of source.slots.entries()) {
    const rgb = colorOf(slot);
    data.set([(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255, at === 0 ? 0 : 255], at * 4);
  }
  const mapped = mapToPalette({ data, width: source.slots.length, height: 1 }, { palette, transparent: false, alphaThreshold: 1 });
  for (const [at, value] of mapped.pixels.entries()) table[at] = at === 0 ? 0 : value + 1;
  return table;
};

export { nearestTable };
