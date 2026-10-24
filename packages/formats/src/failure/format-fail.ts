/* @layer core @kind logic */
import type { FormatErrorCode, FormatFailure } from './format.type';

const formatFail = (code: FormatErrorCode, message: string): FormatFailure => ({
  ok: false,
  code,
  message,
});

export { formatFail };
