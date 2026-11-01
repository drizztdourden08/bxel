/* @layer core @kind logic */
import { shownInTree } from '../layer-tree/shown-in-tree';
import type { FrameId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Layer, Sprite } from '../model/sprite.type';
import { paletteRgba } from '../color/palette-rgba';
import { drawnLayers } from './drawn-layers';
import type { FrameView, RgbaPicture } from './drawn-layers.type';
import { RGBA_BYTES } from './frame-to-rgba.constants';
import { layerKindOf } from './layer-kind-of';
import { viewAlpha } from './view-alpha';

const CHANNEL_MAX = 255;

type Source = (position: number, rgba: Float32Array) => boolean;

const over = (out: Float32Array, at: number, source: Float32Array, alpha: number): void => {
  const sa = ((source[3] ?? 0) / CHANNEL_MAX) * alpha;
  if (sa <= 0) return;
  const da = (out[at + 3] ?? 0) / CHANNEL_MAX;
  const oa = sa + da * (1 - sa);
  for (let channel = 0; channel < 3; channel += 1) {
    out[at + channel] = ((source[channel] ?? 0) * sa + (out[at + channel] ?? 0) * da * (1 - sa)) / oa;
  }
  out[at + 3] = oa * CHANNEL_MAX;
};

const indexSource = (pixels: Uint8Array, table: Uint8Array): Source => (position, rgba) => {
  const value = pixels[position] ?? 0;
  if (value === 0) return false;
  rgba.set(table.subarray(value * RGBA_BYTES, value * RGBA_BYTES + RGBA_BYTES));
  return true;
};

const pictureSource = (sprite: Sprite, layer: Layer, picture: RgbaPicture): Source => (position, rgba) => {
  const x = (position % sprite.width) - (layer.reference?.x ?? 0);
  const y = Math.floor(position / sprite.width) - (layer.reference?.y ?? 0);
  if (x < 0 || y < 0 || x >= picture.width || y >= picture.height) return false;
  const at = (y * picture.width + x) * RGBA_BYTES;
  rgba.set(picture.data.subarray(at, at + RGBA_BYTES));
  return true;
};

const sourcesOf = (sprite: Sprite, bank: PaletteBank, frameId: FrameId, view: FrameView): { source: Source; alpha: number }[] => {
  const table = paletteRgba(bank);
  const drawn = new Map(drawnLayers(sprite, frameId).map((each) => [each.layer.id, each.pixels]));
  return sprite.layers.flatMap((layer) => {
    const alpha = view.alpha ? view.alpha(layer) : viewAlpha(sprite.layers, layer);
    const pixels = drawn.get(layer.id);
    if (pixels) return [{ source: indexSource(pixels, table), alpha }];
    const picture = layerKindOf(layer) === 'reference' && shownInTree(sprite.layers, layer) ? view.reference?.(layer) : null;
    return picture ? [{ source: pictureSource(sprite, layer, picture), alpha }] : [];
  });
};

const blendFrameRgba = (sprite: Sprite, bank: PaletteBank, frameId: FrameId, view: FrameView): Uint8Array<ArrayBuffer> => {
  const area = sprite.width * sprite.height;
  const sum = new Float32Array(area * RGBA_BYTES);
  const sample = new Float32Array(RGBA_BYTES);
  for (const { source, alpha } of sourcesOf(sprite, bank, frameId, view)) {
    for (let position = 0; position < area; position += 1) {
      if (source(position, sample)) over(sum, position * RGBA_BYTES, sample, alpha);
    }
  }
  const out = new Uint8Array(area * RGBA_BYTES);
  for (let at = 0; at < out.length; at += 1) out[at] = Math.round(sum[at] ?? 0);
  return out;
};

export { blendFrameRgba };
