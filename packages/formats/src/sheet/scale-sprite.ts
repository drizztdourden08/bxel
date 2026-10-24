/* @layer core @kind logic */
import { scaleBox } from './scale-box';
import type { SheetPivot, SheetSliceEntry, SheetSpriteEntry } from './sheet-metadata.type';

const scalePivot = (pivot: SheetPivot, factor: number): SheetPivot => ({
  x2: pivot.x2 * factor,
  y2: pivot.y2 * factor,
});

const scaleSlice = (slice: SheetSliceEntry, factor: number): SheetSliceEntry => ({
  name: slice.name,
  bounds: scaleBox(slice.bounds, factor),
  pivot: slice.pivot ? scalePivot(slice.pivot, factor) : null,
  center: slice.center ? scaleBox(slice.center, factor) : null,
});

const scaleSprite = (sprite: SheetSpriteEntry, factor: number): SheetSpriteEntry => ({
  name: sprite.name,
  width: sprite.width * factor,
  height: sprite.height * factor,
  pivot: scalePivot(sprite.pivot, factor),
  frames: sprite.frames.map((frame) => ({
    ...frame,
    box: scaleBox(frame.box, factor),
    sourceX: frame.sourceX * factor,
    sourceY: frame.sourceY * factor,
  })),
  tags: sprite.tags,
  slices: sprite.slices.map((slice) => scaleSlice(slice, factor)),
});

export { scaleSprite };
