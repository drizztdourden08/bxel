/* @layer renderer-app @kind logic */
import { findBank, flattenTilemap } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import { bankRgba } from '../../export/bank-rgba';
import { CHANNELS } from './tileset-overlay.constants';

const onlyLayer = (artwork: Artwork, tilemapId: string, layerId: string): Artwork => ({
  ...artwork,
  tilemaps: artwork.tilemaps.map((map) =>
    map.id === tilemapId ? { ...map, layers: map.layers.filter((layer) => layer.id === layerId).map((layer) => ({ ...layer, visible: true })) } : map,
  ),
});

const tilemapImage = (artwork: Artwork, target: { readonly tilemapId: string; readonly layerId?: string }): RgbaImage | null => {
  const source = target.layerId === undefined ? artwork : onlyLayer(artwork, target.tilemapId, target.layerId);
  const flat = flattenTilemap(source, target.tilemapId as Parameters<typeof flattenTilemap>[1]);
  const bank = findBank(source, flat.bankId);
  if (!bank) return null;
  const table = bankRgba(bank);
  const data = new Uint8ClampedArray(flat.pixels.length * CHANNELS);
  flat.pixels.forEach((index, at) => data.set(table.subarray(index * CHANNELS, index * CHANNELS + CHANNELS), at * CHANNELS));
  return { data, width: flat.width, height: flat.height };
};

export { tilemapImage };
