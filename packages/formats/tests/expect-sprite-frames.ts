/* @layer tests @kind helper */
import type { ExportSprite, RgbaImage, SheetSpriteEntry } from '@bxel/formats';
import { expect } from 'vitest';
import { expectSheetFrame } from './expect-sheet-frame';
import { frameEntry } from './frame-entry';

const expectSpriteFrames = (sheet: RgbaImage, sprite: ExportSprite, entry: SheetSpriteEntry): void => {
  expect(entry.frames).toHaveLength(sprite.frames.length);
  sprite.frames.forEach((frame, i) => {
    expectSheetFrame(sheet, sprite, frame, frameEntry(entry, i));
  });
};

export { expectSpriteFrames };
