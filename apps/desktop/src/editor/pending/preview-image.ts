/* @layer renderer-app @kind logic */
import { overlayPixels, writeRect } from '@bxel/document';
import type { Layer, PreviewCel, TransactionOk } from '@bxel/document';
import type { Size } from '@bxel/raster';
import { bankTable } from '../bank-table';
import { CHANNELS } from '../bank-table.constants';
import type { EditorTarget } from '../editor.type';
import type { PreviewFrame } from './pending.type';

const frameSize = (target: EditorTarget, result: TransactionOk): Size => {
  const change = result.changes.sprites.find((each) => each.id === target.sprite.id);
  const first = change?.structure === true ? change.cels[0] : undefined;
  return first ? { width: first.rect.width, height: first.rect.height } : target.sprite;
};

const layerBuffer = (target: EditorTarget, layer: Layer, size: Size, cels: readonly PreviewCel[]): Uint8Array => {
  const { sprite, frameId } = target;
  const buffer = new Uint8Array(size.width * size.height);
  const celId = layer.cels[frameId];
  const same = size.width === sprite.width && size.height === sprite.height;
  const base = same && celId !== undefined ? sprite.cels[celId]?.pixels : undefined;
  if (base) buffer.set(base);
  const change = cels.find((cel) => cel.layerId === layer.id && cel.frameId === frameId);
  if (change) writeRect({ target: buffer, stride: size.width, rect: change.rect, pixels: change.pixels, skipZero: false });
  return buffer;
};

const previewImage = (target: EditorTarget, result: TransactionOk): PreviewFrame | null => {
  const { preview } = result;
  if (!preview || preview.truncated) return null;
  const size = frameSize(target, result);
  const indices = new Uint8Array(size.width * size.height);
  for (const layer of target.sprite.layers) {
    if (layer.visible) overlayPixels(indices, layerBuffer(target, layer, size, preview.cels));
  }
  const table = bankTable(target.bank);
  const rgba = new Uint8ClampedArray(indices.length * CHANNELS);
  for (const [at, index] of indices.entries()) rgba.set(table.subarray(index * CHANNELS, (index + 1) * CHANNELS), at * CHANNELS);
  return { width: size.width, height: size.height, rgba, indices };
};

export { previewImage };
