/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { isFormatFailure } from '../failure/is-format-failure';
import { addGifFrame } from './add-gif-frame';
import { decodeLzw } from './decode-lzw';
import { GIF_LIMITS } from './gif-limits.constants';
import type { ByteReader, GifDecodeState } from './gif.type';
import { readGifDescriptor } from './read-gif-descriptor';
import { readSubBlocks } from './read-sub-blocks';

const readGifImage = (reader: ByteReader, state: GifDecodeState): FormatFailure | undefined => {
  const descriptor = readGifDescriptor(reader, state.screen);
  if (isFormatFailure(descriptor)) return descriptor;
  const minCodeSize = byteAt(reader.bytes, reader.pos);
  reader.pos += 1;
  if (!descriptor.table || minCodeSize < GIF_LIMITS.MIN_CODE_SIZE || minCodeSize >= GIF_LIMITS.MAX_CODE_WIDTH) {
    return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_DATA, 'An image has no colour table or a bad code size');
  }
  const data = readSubBlocks(reader);
  if (!data) return formatFail(FORMAT_ERROR_CODE.GIF_TRUNCATED, 'File ends inside image data');
  const indices = decodeLzw(data, minCodeSize, descriptor.width * descriptor.height);
  if (!indices) return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_DATA, 'Image data fails to decompress');
  return addGifFrame(state, descriptor, indices);
};

export { readGifImage };
