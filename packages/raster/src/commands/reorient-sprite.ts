/* @layer core @kind logic */
import type { Slice, Sprite } from '@bxel/document';
import type { Orientation } from '../transform/transform.type';
import { transformPivot } from '../transform/transform-pivot';
import { transformRect } from '../transform/transform-rect';
import { transformSize } from '../transform/transform-size';

const reorientSlice = (slice: Slice, orientation: Orientation, size: Sprite): Slice => ({
  ...slice,
  rect: transformRect(orientation, size, slice.rect),
  pivot: slice.pivot && transformPivot(orientation, size, slice.pivot),
  center: slice.center && transformRect(orientation, size, slice.center),
});

const reorientSprite = (sprite: Sprite, orientation: Orientation): Sprite => {
  const pivot = transformPivot(orientation, sprite, sprite.pivot);
  const unmoved = pivot.x2 === sprite.pivot.x2 && pivot.y2 === sprite.pivot.y2;
  return {
    ...sprite,
    ...transformSize(orientation, sprite),
    pivot: unmoved ? sprite.pivot : pivot,
    slices: sprite.slices.length === 0 ? sprite.slices : sprite.slices.map((slice) => reorientSlice(slice, orientation, sprite)),
  };
};

export { reorientSprite };
