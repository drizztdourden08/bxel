/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { GIF_BLOCK } from './gif-block.constants';
import type { ByteReader, GifDecodeState } from './gif.type';
import { readGifExtension } from './read-gif-extension';
import { readGifImage } from './read-gif-image';

const readGifBlock = (
  reader: ByteReader,
  state: GifDecodeState,
  introducer: number,
): FormatFailure | undefined => {
  if (introducer === GIF_BLOCK.EXTENSION) return readGifExtension(reader, state);
  if (introducer === GIF_BLOCK.IMAGE) return readGifImage(reader, state);
  return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_DATA, `Unknown block 0x${introducer.toString(16)}`);
};

const readGifBlocks = (reader: ByteReader, state: GifDecodeState): FormatFailure | undefined => {
  while (reader.pos < reader.bytes.length) {
    const introducer = byteAt(reader.bytes, reader.pos);
    reader.pos += 1;
    if (introducer === GIF_BLOCK.TRAILER) return undefined;
    const failure = readGifBlock(reader, state, introducer);
    if (failure) return failure;
  }
  return formatFail(FORMAT_ERROR_CODE.GIF_TRUNCATED, 'File ends before the GIF trailer');
};

export { readGifBlocks };
