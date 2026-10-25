/* @layer renderer-app @kind logic */
import { encodeApng } from '@bxel/formats';
import { bytesOf } from './bytes-of';
import { IMPORTED_ANIMATION } from './imported-animation.constants';
import { solidRgba } from './solid-rgba';

const apngBytes = (count: number): Uint8Array => {
  const { side, delaysMs, colours } = IMPORTED_ANIMATION;
  return bytesOf(
    encodeApng({
      width: side,
      height: side,
      palette: undefined,
      loops: 0,
      frames: delaysMs.slice(0, count).map((delayMs, at) => ({ pixels: solidRgba(colours[at] ?? []), delayMs })),
    }),
  );
};

export { apngBytes };
