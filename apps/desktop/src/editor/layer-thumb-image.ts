/* @layer renderer-app @kind logic */
import { cellKey, frameToRgba } from '@bxel/document';
import type { CelId, FrameId, Layer, MapLayer, PaletteBank, Sprite } from '@bxel/document';
import type { FrameImage } from '../sheet/sheet.type';
import type { Overlay } from './editor.type';
import { CELL_SATURATION, CELL_LIGHTNESS, GOLDEN_ANGLE, OPAQUE } from './layer-thumb.constants';

/** The pixels of one layer in one frame, in the colours of the palette. Other layers are left out. */
const spriteLayerImage = (sprite: Sprite, bank: PaletteBank, layer: Layer, frameId: FrameId): FrameImage => ({
  width: sprite.width,
  height: sprite.height,
  rgba: Uint8ClampedArray.from(frameToRgba({ ...sprite, layers: [{ ...layer, visible: true }] }, bank, frameId)),
});

const LIVE_CEL = 'cel_live' as CelId;

/**
 * The same layer while a stroke is being drawn: the committed pixels, with every pixel the stroke has changed
 * written over them. The stroke works on the whole flattened frame, so a pixel it changed is one it wrote to this layer.
 */
const liveSpriteLayerImage = (sprite: Sprite, bank: PaletteBank, layer: Layer, frameId: FrameId, live: Overlay): FrameImage => {
  const celId = layer.cels[frameId];
  const pixels = (celId === undefined ? undefined : sprite.cels[celId]?.pixels)?.slice() ?? new Uint8Array(sprite.width * sprite.height);
  live.indices.forEach((value, at) => {
    if (value !== live.base[at]) pixels[at] = value;
  });
  const drawn: Layer = { ...layer, visible: true, cels: { [frameId]: LIVE_CEL } };
  const withStroke: Sprite = { ...sprite, layers: [drawn], cels: { ...sprite.cels, [LIVE_CEL]: { id: LIVE_CEL, pixels } } };
  return { width: sprite.width, height: sprite.height, rgba: Uint8ClampedArray.from(frameToRgba(withStroke, bank, frameId)) };
};

const channel = (hue: number, offset: number): number => {
  const k = (offset + hue / 30) % 12;
  const a = CELL_SATURATION * Math.min(CELL_LIGHTNESS, 1 - CELL_LIGHTNESS);
  return Math.round(255 * (CELL_LIGHTNESS - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
};

/** A map layer as a minimap: one pixel per cell, a colour per tile, empty cells see through. */
const mapLayerImage = (layer: MapLayer, columns: number, rows: number): FrameImage => {
  const rgba = new Uint8ClampedArray(columns * rows * 4);
  layer.cells.forEach((cell, at) => {
    const key = cellKey(cell);
    if (key === 0) return;
    const hue = (key * GOLDEN_ANGLE) % 360;
    rgba.set([channel(hue, 0), channel(hue, 8), channel(hue, 4), OPAQUE], at * 4);
  });
  return { width: columns, height: rows, rgba };
};

export { liveSpriteLayerImage, mapLayerImage, spriteLayerImage };
