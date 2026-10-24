/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { GIF_BLOCK } from './gif-block.constants';
import { GIF_NETSCAPE } from './gif-netscape.constants';
import type { ByteReader, GifDecodeState } from './gif.type';
import { readSubBlocks } from './read-sub-blocks';
import { readU16Le } from './read-u16-le';

const applyControl = (state: GifDecodeState, data: Uint8Array): void => {
  const flags = byteAt(data, 0);
  state.control = {
    disposal: (flags >> 2) & 7,
    delayCs: readU16Le(data, 1),
    transparent: (flags & GIF_BLOCK.TRANSPARENT_FLAG) === 0 ? -1 : byteAt(data, 3),
  };
};

const applyLoop = (state: GifDecodeState, data: Uint8Array): void => {
  const named = GIF_NETSCAPE.every((byte, i) => data[i] === byte);
  if (!named || byteAt(data, GIF_NETSCAPE.length) !== 1) return;
  const count = readU16Le(data, GIF_NETSCAPE.length + 1);
  state.loops = count === 0 ? 0 : count + 1;
};

const readGifExtension = (reader: ByteReader, state: GifDecodeState): FormatFailure | undefined => {
  const label = byteAt(reader.bytes, reader.pos);
  reader.pos += 1;
  const data = readSubBlocks(reader);
  if (!data) return formatFail(FORMAT_ERROR_CODE.GIF_TRUNCATED, 'File ends inside an extension');
  if (label === GIF_BLOCK.GRAPHIC_CONTROL && data.length >= 4) applyControl(state, data);
  if (label === GIF_BLOCK.APPLICATION && data.length >= GIF_NETSCAPE.length + 3) {
    applyLoop(state, data);
  }
  return undefined;
};

export { readGifExtension };
