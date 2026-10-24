/* @layer core @kind logic */
import { isFormatFailure } from '../failure/is-format-failure';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatBytesResult } from '../failure/format.type';
import { encodePngRgba } from '../encode-png-rgba';
import type { PaletteFile, PalettePngLayout } from './palette-file.type';
import { parsePaletteColors } from './parse-palette-colors';

const writePalettePng = (palette: PaletteFile, layout: PalettePngLayout): FormatBytesResult => {
  const parsed = parsePaletteColors(palette);
  if (isFormatFailure(parsed)) return parsed;
  if (parsed.length < 1) {
    return formatFail(FORMAT_ERROR_CODE.PALETTE_INVALID_INPUT, 'A palette image needs at least one colour');
  }
  const data = Uint8ClampedArray.from(parsed.flat());
  const length = parsed.length;
  const encoded = encodePngRgba({
    data,
    width: layout === 'row' ? length : 1,
    height: layout === 'row' ? 1 : length,
  });
  if (!encoded.ok) return formatFail(FORMAT_ERROR_CODE.PALETTE_INVALID_INPUT, encoded.message);
  return encoded;
};

export { writePalettePng };
