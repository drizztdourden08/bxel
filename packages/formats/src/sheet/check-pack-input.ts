/* @layer core @kind logic */
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { isCount } from './is-count';
import { isSize } from './is-size';
import { isValidLayout } from './is-valid-layout';
import { SHEET_LIMITS } from './sheet-limits.constants';
import type { PackItem, PackSettings } from './sheet.type';

const bad = (message: string): FormatFailure =>
  formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, message);

const checkPackInput = (
  items: readonly PackItem[],
  settings: PackSettings,
): FormatFailure | undefined => {
  if (items.length < 1 || items.length > SHEET_LIMITS.MAX_ITEMS) {
    return bad(`A sheet needs 1 to ${SHEET_LIMITS.MAX_ITEMS} items`);
  }
  if (items.some((item) => !isSize(item.width) || !isSize(item.height))) {
    return bad('Item sizes must be integers >= 1');
  }
  if (!isCount(settings.margin) || !isCount(settings.extrude)) {
    return bad('Margin and extrusion must be integers >= 0');
  }
  if (!isValidLayout(settings.layout)) return bad('The sheet layout holds an invalid number');
  return undefined;
};

export { checkPackInput };
