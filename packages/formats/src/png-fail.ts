/* @layer core @kind logic */
import type { PngErrorCode, PngFailure } from './png.type';

const pngFail = (code: PngErrorCode, message: string): PngFailure => ({
  ok: false,
  code,
  message,
});

export { pngFail };
