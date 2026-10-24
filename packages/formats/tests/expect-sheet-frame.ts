/* @layer tests @kind helper */
import { compositeIndexed, trimRgba, untrimRgba } from '@bxel/formats';
import type { ExportFrame, ExportSprite, RgbaImage, SheetFrameEntry } from '@bxel/formats';
import { expect } from 'vitest';
import { cropOf } from './crop-of';

const expectSheetFrame = (
  sheet: RgbaImage,
  sprite: ExportSprite,
  frame: ExportFrame,
  entry: SheetFrameEntry,
): void => {
  const flat = compositeIndexed(frame.layers, sprite.palette, sprite);
  const trimmed = trimRgba(flat);
  expect(entry.box.width).toBe(trimmed.image.width);
  expect(entry.box.height).toBe(trimmed.image.height);
  expect([entry.sourceX, entry.sourceY]).toEqual([trimmed.offsetX, trimmed.offsetY]);
  expect(entry.durationMs).toBe(frame.durationMs);
  const crop = cropOf(sheet, entry.box);
  expect(crop).toEqual(Array.from(trimmed.image.data));
  const placed = { ...trimmed.image, data: Uint8ClampedArray.from(crop) };
  expect(Array.from(untrimRgba({ ...trimmed, image: placed }).data)).toEqual(Array.from(flat.data));
};

export { expectSheetFrame };
