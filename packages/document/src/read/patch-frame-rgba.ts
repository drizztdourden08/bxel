/* @layer core @kind logic */
import { unionRect } from '../geometry/union-rect';
import type { Rect } from '../model/geometry.type';
import type { FrameId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Sprite } from '../model/sprite.type';
import { RGBA_BYTES } from './frame-to-rgba.constants';
import { layerPixels } from './layer-pixels';
import { packedTable } from './packed-table';
import type { FramePatch } from './patch-frame-rgba.type';

const visibleCels = (sprite: Sprite, frameId: FrameId): Uint8Array[] =>
  sprite.layers.flatMap((layer) => {
    const pixels = layer.visible ? layerPixels(sprite, layer, frameId) : undefined;
    return pixels ? [pixels] : [];
  });

const topIndex = (cels: readonly Uint8Array[], position: number): number => {
  let top = 0;
  for (const pixels of cels) {
    const value = pixels[position] ?? 0;
    if (value !== 0) top = value;
  }
  return top;
};

const clipped = (sprite: Sprite, rect: Rect): Rect => {
  const left = Math.max(0, rect.x);
  const top = Math.max(0, rect.y);
  const right = Math.min(sprite.width, rect.x + rect.width);
  const bottom = Math.min(sprite.height, rect.y + rect.height);
  return { x: left, y: top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
};

const patchRow = (patch: FramePatch, row: Rect): Rect | null => {
  const { words, cels, table, width } = patch;
  let first = -1;
  let last = -1;
  for (let x = row.x; x < row.x + row.width; x += 1) {
    const position = row.y * width + x;
    const colour = table[topIndex(cels, position)] ?? 0;
    if (words[position] === colour) continue;
    words[position] = colour;
    first = first < 0 ? x : first;
    last = x;
  }
  return first < 0 ? null : { x: first, y: row.y, width: last - first + 1, height: 1 };
};

const patchFrameRgba = (sprite: Sprite, bank: PaletteBank, frameId: FrameId, image: { rgba: Uint8Array | Uint8ClampedArray; rect: Rect }): Rect | null => {
  const { rgba } = image;
  const words = new Uint32Array(rgba.buffer, rgba.byteOffset, Math.floor(rgba.length / RGBA_BYTES));
  const patch: FramePatch = { words, cels: visibleCels(sprite, frameId), table: packedTable(bank), width: sprite.width };
  const area = clipped(sprite, image.rect);
  let changed: Rect | null = null;
  for (let y = area.y; y < area.y + area.height; y += 1) {
    const row = patchRow(patch, { x: area.x, y, width: area.width, height: 1 });
    if (row) changed = changed ? unionRect(changed, row) : row;
  }
  return changed;
};

export { patchFrameRgba };
