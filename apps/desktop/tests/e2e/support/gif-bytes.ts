/* @layer renderer-app @kind logic */
import { encodeGif } from '@bxel/formats';
import { bytesOf } from './bytes-of';
import { IMPORTED_ANIMATION } from './imported-animation.constants';

const gifBytes = (count: number): Uint8Array => {
  const { side, delaysMs, colours } = IMPORTED_ANIMATION;
  return bytesOf(
    encodeGif({
      width: side,
      height: side,
      palette: Uint8Array.from(colours.flat()),
      transparentIndex: null,
      loops: 0,
      frames: delaysMs.slice(0, count).map((delayMs, at) => ({ indices: new Uint8Array(side * side).fill(at), delayMs })),
    }),
  );
};

export { gifBytes };
