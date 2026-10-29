/* @layer core @kind logic */
import type { Animation } from '../../model/animation.type';
import type { Sheet } from '../../model/sheet.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const entryMissing = (animation: Animation, sheet: Sheet) =>
  fail(ERROR_CODE.TARGET_NOT_FOUND, `Animation "${animation.name}" is not on sheet "${sheet.name}".`, { path: 'options.animation' });

export { entryMissing };
