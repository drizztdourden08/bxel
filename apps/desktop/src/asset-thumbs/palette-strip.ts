/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import { PALETTE_SWATCH_MAX } from './asset-thumbs.constants';

const hexToRgb = (hex: string): readonly [number, number, number] => {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const paletteStrip = (bank: PaletteBank): RgbaImage | null => {
  const colours = bank.slots.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : [])).slice(0, PALETTE_SWATCH_MAX);
  if (colours.length === 0) return null;
  const columns = Math.ceil(Math.sqrt(colours.length));
  const rows = Math.ceil(colours.length / columns);
  const data = new Uint8ClampedArray(columns * rows * 4);
  colours.forEach((hex, at) => {
    const [red, green, blue] = hexToRgb(hex);
    data.set([red, green, blue, 255], at * 4);
  });
  return { data, width: columns, height: rows };
};

export { paletteStrip };
