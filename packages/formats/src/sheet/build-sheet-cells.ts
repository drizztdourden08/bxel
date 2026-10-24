/* @layer core @kind logic */
import type { RgbaImage } from '../png.type';
import { compositeIndexed } from './composite-indexed';
import type { ExportSprite, SheetCell } from './export-sheet.type';
import { sheetFrameKey } from './sheet-frame-key';
import type { TrimmedImage } from './sheet.type';
import { trimRgba } from './trim-rgba';

const keepWhole = (image: RgbaImage): TrimmedImage => ({
  image,
  offsetX: 0,
  offsetY: 0,
  sourceWidth: image.width,
  sourceHeight: image.height,
});

const buildSheetCells = (sprites: readonly ExportSprite[], trim: boolean): SheetCell[] =>
  sprites.flatMap((sprite, spriteIndex) =>
    sprite.frames.map((frame, frameIndex) => {
      const image = compositeIndexed(frame.layers, sprite.palette, sprite);
      return {
        key: sheetFrameKey(sprite.name, frameIndex, sprite.frames.length),
        spriteIndex,
        durationMs: frame.durationMs,
        trimmed: trim ? trimRgba(image) : keepWhole(image),
      };
    }),
  );

export { buildSheetCells };
