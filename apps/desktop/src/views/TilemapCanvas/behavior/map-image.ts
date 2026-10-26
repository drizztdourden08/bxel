/* @layer renderer-app @kind logic */
import { findBank, flattenTilemap } from '@bxel/document';
import type { Artwork, Tilemap } from '@bxel/document';
import { trackPixels } from '../../../canvas-dirty/track-pixels';
import { bankRgba } from '../../../export/bank-rgba';
import { CHANNELS } from '../../../sheet/sheet.constants';

const mapImage = (artwork: Artwork, tilemap: Tilemap): ImageData | null => {
  const flat = flattenTilemap(artwork, tilemap.id);
  const bank = findBank(artwork, flat.bankId);
  if (!bank) return null;
  const table = bankRgba(bank);
  const rgba = new Uint8ClampedArray(flat.pixels.length * CHANNELS);
  flat.pixels.forEach((index, at) => rgba.set(table.subarray(index * CHANNELS, index * CHANNELS + CHANNELS), at * CHANNELS));
  trackPixels(rgba);
  return new ImageData(rgba, flat.width, flat.height);
};

export { mapImage };
