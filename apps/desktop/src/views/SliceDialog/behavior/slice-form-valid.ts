/* @layer renderer-app @kind logic */
import type { Rect, Size } from '@bxel/document';
import type { SliceForm } from '../SliceDialog.type';

const inside = (rect: Rect, bounds: Size): boolean =>
  Number.isInteger(rect.x) && Number.isInteger(rect.y) && Number.isInteger(rect.width) && Number.isInteger(rect.height) &&
  rect.width >= 1 && rect.height >= 1 && rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= bounds.width && rect.y + rect.height <= bounds.height;

const sliceFormValid = (form: SliceForm, sprite: Size, taken: readonly string[]): boolean => {
  if (form.name.trim() === '' || taken.includes(form.name.trim())) return false;
  if (!inside(form.rect, sprite)) return false;
  if (form.centreOn && !inside(form.centre, form.rect)) return false;
  const { pivot, rect } = form;
  return !form.pivotOn || (pivot.x2 >= 0 && pivot.y2 >= 0 && pivot.x2 <= 2 * rect.width && pivot.y2 <= 2 * rect.height);
};

export { sliceFormValid };
