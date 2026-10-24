/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { colorTableLength } from './color-table-length';
import { GIF_BLOCK } from './gif-block.constants';
import type { ByteReader, GifDescriptor, GifScreen } from './gif.type';
import { readColorTable } from './read-color-table';
import { readU16Le } from './read-u16-le';

const readGifDescriptor = (
  reader: ByteReader,
  screen: GifScreen,
): GifDescriptor | FormatFailure => {
  const { bytes, pos } = reader;
  if (pos + GIF_BLOCK.DESCRIPTOR_LENGTH > bytes.length) {
    return formatFail(FORMAT_ERROR_CODE.GIF_TRUNCATED, 'File ends inside an image descriptor');
  }
  const x = readU16Le(bytes, pos);
  const y = readU16Le(bytes, pos + 2);
  const width = readU16Le(bytes, pos + 4);
  const height = readU16Le(bytes, pos + 6);
  const packed = byteAt(bytes, pos + 8);
  reader.pos += GIF_BLOCK.DESCRIPTOR_LENGTH;
  if (width < 1 || height < 1 || x + width > screen.width || y + height > screen.height) {
    return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_DATA, 'An image lies outside the screen');
  }
  const length = colorTableLength(packed);
  const local = readColorTable(reader, length);
  if (length > 0 && !local) {
    return formatFail(FORMAT_ERROR_CODE.GIF_TRUNCATED, 'File ends inside the colour table');
  }
  const interlaced = (packed & GIF_BLOCK.INTERLACE_FLAG) !== 0;
  return { x, y, width, height, interlaced, table: local ?? screen.table };
};

export { readGifDescriptor };
