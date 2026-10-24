/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import type { ExportFrame } from './export-sheet.type';

const bad = (message: string): FormatFailure =>
  formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_INPUT, message);

const checkExportFrame = (
  frame: ExportFrame,
  pixelCount: number,
  entries: number,
): FormatFailure | undefined => {
  if (!Number.isInteger(frame.durationMs) || frame.durationMs < 1) {
    return bad('Frame durations must be integers >= 1');
  }
  for (const layer of frame.layers) {
    if (layer.length !== pixelCount) return bad(`A layer holds ${layer.length} indices, expected ${pixelCount}`);
    if (layer.some((index) => index >= entries)) return bad('A layer index is outside the palette');
  }
  return undefined;
};

export { checkExportFrame };
