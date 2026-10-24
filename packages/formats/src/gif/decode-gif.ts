/* @layer core @kind logic */
import type { AnimationDecodeResult } from '../animation/animation.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { isFormatFailure } from '../failure/is-format-failure';
import type { ByteReader, GifDecodeState } from './gif.type';
import { readGifBlocks } from './read-gif-blocks';
import { readGifScreen } from './read-gif-screen';

const decodeGif = (bytes: Uint8Array): AnimationDecodeResult => {
  const reader: ByteReader = { bytes, pos: 0 };
  const screen = readGifScreen(reader);
  if (isFormatFailure(screen)) return screen;
  const state: GifDecodeState = {
    screen,
    canvas: new Uint8ClampedArray(screen.width * screen.height * 4),
    frames: [],
    loops: 1,
    control: undefined,
    pending: undefined,
  };
  const failure = readGifBlocks(reader, state);
  if (failure) return failure;
  if (state.frames.length === 0) {
    return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_DATA, 'The GIF holds no frames');
  }
  return { ok: true, width: screen.width, height: screen.height, loops: state.loops, frames: state.frames };
};

export { decodeGif };
