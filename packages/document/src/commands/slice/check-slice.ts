/* @layer core @kind logic */
import type { Pivot2, Rect, Size } from '../../model/geometry.type';
import { checkPivot } from '../../validate/check-pivot';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const within = (rect: Rect, size: Size): boolean =>
  rect.width >= 1 && rect.height >= 1 && rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= size.width && rect.y + rect.height <= size.height;

const checkSlice = (shape: { rect: Rect; pivot: Pivot2 | null; center: Rect | null }, sprite: Size): void => {
  const { rect, pivot, center } = shape;
  if (!within(rect, sprite)) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, 'A slice lies inside the sprite and is at least 1 by 1 pixel.', { path: 'options.rect' });
  }
  if (pivot) checkPivot(pivot, rect);
  if (center && !within(center, rect)) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, 'The 9-slice center lies inside the slice.', { path: 'options.center' });
  }
};

export { checkSlice };
