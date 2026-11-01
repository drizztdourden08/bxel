/* @layer renderer-app @kind logic */
import { findBank, flattenTilemap } from '@bxel/document';
import type { Artwork, TilemapId } from '@bxel/document';
import { bankRgba } from '../../../export/bank-rgba';
import { CHANNELS } from '../../../sheet/sheet.constants';
import type { FlatRgba } from '../TilemapCanvas.type';

const flatMapRgba = (artwork: Artwork, tilemapId: TilemapId): FlatRgba | null => {
  const flat = flattenTilemap(artwork, tilemapId);
  const bank = findBank(artwork, flat.bankId);
  if (!bank) return null;
  const table = bankRgba(bank);
  const rgba = new Uint8ClampedArray(flat.pixels.length * CHANNELS);
  flat.pixels.forEach((index, at) => rgba.set(table.subarray(index * CHANNELS, index * CHANNELS + CHANNELS), at * CHANNELS));
  return { rgba, width: flat.width, height: flat.height };
};

export { flatMapRgba };
