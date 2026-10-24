/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { colorTableLength } from './color-table-length';
import { GIF_BLOCK } from './gif-block.constants';
import { GIF_LIMITS } from './gif-limits.constants';
import { GIF_VERSIONS } from './gif-versions.constants';
import type { ByteReader, GifScreen } from './gif.type';
import { readColorTable } from './read-color-table';
import { readU16Le } from './read-u16-le';

const readGifScreen = (reader: ByteReader): GifScreen | FormatFailure => {
  const { bytes } = reader;
  const start = GIF_BLOCK.HEADER_LENGTH + GIF_BLOCK.SCREEN_LENGTH;
  if (bytes.length < start) {
    return formatFail(FORMAT_ERROR_CODE.GIF_TRUNCATED, 'File ends inside the GIF header');
  }
  const version = String.fromCharCode(...bytes.subarray(0, GIF_BLOCK.HEADER_LENGTH));
  if (!GIF_VERSIONS.includes(version)) {
    return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_DATA, 'Not a GIF file');
  }
  const width = readU16Le(bytes, GIF_BLOCK.HEADER_LENGTH);
  const height = readU16Le(bytes, GIF_BLOCK.HEADER_LENGTH + 2);
  if (width < 1 || height < 1 || width > GIF_LIMITS.MAX_SIDE || height > GIF_LIMITS.MAX_SIDE) {
    return formatFail(FORMAT_ERROR_CODE.GIF_TOO_LARGE, `Screen ${width} x ${height} is outside 1 to ${GIF_LIMITS.MAX_SIDE}`);
  }
  reader.pos = start;
  const length = colorTableLength(byteAt(bytes, GIF_BLOCK.HEADER_LENGTH + 4));
  const table = readColorTable(reader, length);
  if (length > 0 && !table) {
    return formatFail(FORMAT_ERROR_CODE.GIF_TRUNCATED, 'File ends inside the colour table');
  }
  return { width, height, table };
};

export { readGifScreen };
