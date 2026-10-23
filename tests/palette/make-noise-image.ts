/* @layer tests @kind helper */
import type { RgbaImage } from '@bxel/palette';

const makeNoiseImage = (size: number, seed: number): RgbaImage => {
  const data = new Uint8ClampedArray(size * size * 4);
  let state = seed >>> 0;
  for (let at = 0; at < data.length; at += 4) {
    for (let channel = 0; channel < 3; channel += 1) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      data[at + channel] = state >>> 24;
    }
    data[at + 3] = 255;
  }
  return { data, width: size, height: size };
};

export { makeNoiseImage };
