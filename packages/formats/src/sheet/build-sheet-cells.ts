/* @layer core @kind logic */
import type { RgbaImage } from '../png.type';
import { compositeIndexed } from './composite-indexed';
import type { ExportSprite, SheetCell } from './export-sheet.type';
import { imageKey } from './image-key';
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

const spriteCells = (sprite: ExportSprite, spriteIndex: number, trim: boolean, merge: boolean): SheetCell[] => {
  const first = new Map<string, number>();
  return sprite.frames.map((frame, frameIndex) => {
    const image = compositeIndexed(frame.layers, sprite.palette, sprite);
    const trimmed = trim ? trimRgba(image) : keepWhole(image);
    const key = merge ? imageKey(trimmed) : '';
    const twin = merge ? first.get(key) : undefined;
    if (merge && twin === undefined) first.set(key, frameIndex);
    return {
      key: sheetFrameKey(sprite.name, frameIndex, sprite.frames.length),
      spriteIndex,
      frameIndex,
      durationMs: frame.durationMs,
      trimmed,
      ...(twin === undefined ? {} : { twin }),
      ...(frame.label === undefined ? {} : { label: frame.label }),
    };
  });
};

const buildSheetCells = (sprites: readonly ExportSprite[], trim: boolean, merge = false): SheetCell[] =>
  sprites.flatMap((sprite, spriteIndex) => spriteCells(sprite, spriteIndex, trim, merge));

export { buildSheetCells };
