/* @layer renderer-app @kind logic */
import { findBank, findTilemap, flattenTilemap } from '@bxel/document';
import type { Artwork, TilemapId } from '@bxel/document';
import { bankRgba } from '../export/bank-rgba';
import { CHANNELS } from '../sheet/sheet.constants';
import type { OverviewPreview } from './asset-overview.type';

const tilemapPreviewImage = (artwork: Artwork, id: string): OverviewPreview => {
  const tilemap = findTilemap(artwork, id as TilemapId);
  if (!tilemap) return { kind: 'none' };
  const flat = flattenTilemap(artwork, tilemap.id);
  const bank = findBank(artwork, flat.bankId);
  if (!bank || flat.width < 1 || flat.height < 1) return { kind: 'none' };
  const table = bankRgba(bank);
  const data = new Uint8ClampedArray(flat.pixels.length * CHANNELS);
  flat.pixels.forEach((index, at) => data.set(table.subarray(index * CHANNELS, index * CHANNELS + CHANNELS), at * CHANNELS));
  return { kind: 'image', image: { data, width: flat.width, height: flat.height } };
};

export { tilemapPreviewImage };
