/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';

const paletteInvalid = (message: string): FormatFailure =>
  formatFail(FORMAT_ERROR_CODE.PALETTE_INVALID_DATA, message);

export { paletteInvalid };
