/* @layer renderer-app @kind logic */
import { ancestorsOf, descendantIds, findBank, flattenTilemap } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import { bankRgba } from '../../export/bank-rgba';
import { CHANNELS } from './tileset-overlay.constants';

const onlyLayers = (artwork: Artwork, tilemapId: string, ids: readonly string[]): Artwork => ({
  ...artwork,
  tilemaps: artwork.tilemaps.map((map) => {
    if (map.id !== tilemapId) return map;
    const shown = new Set<string>(ids);
    map.layers
      .filter((layer) => ids.includes(layer.id))
      .forEach((layer) => {
        descendantIds(map.layers, layer.id).forEach((id) => shown.add(id));
        ancestorsOf(map.layers, layer).forEach((parent) => shown.add(parent.id));
      });
    return { ...map, layers: map.layers.map((layer) => ({ ...layer, visible: shown.has(layer.id) })) };
  }),
});

const tilemapImage = (artwork: Artwork, target: { readonly tilemapId: string; readonly layerIds?: readonly string[] }): RgbaImage | null => {
  const source = target.layerIds === undefined ? artwork : onlyLayers(artwork, target.tilemapId, target.layerIds);
  const flat = flattenTilemap(source, target.tilemapId as Parameters<typeof flattenTilemap>[1]);
  const bank = findBank(source, flat.bankId);
  if (!bank) return null;
  const table = bankRgba(bank);
  const data = new Uint8ClampedArray(flat.pixels.length * CHANNELS);
  flat.pixels.forEach((index, at) => data.set(table.subarray(index * CHANNELS, index * CHANNELS + CHANNELS), at * CHANNELS));
  return { data, width: flat.width, height: flat.height };
};

export { tilemapImage };
