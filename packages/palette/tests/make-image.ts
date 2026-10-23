/* @layer tests @kind helper */
import type { RgbaImage } from '@bxel/palette';

const makeImage = (
  width: number,
  pixels: readonly (readonly [number, number, number, number])[],
): RgbaImage => {
  const data = new Uint8ClampedArray(pixels.length * 4);
  for (const [at, pixel] of pixels.entries()) data.set(pixel, at * 4);
  return { data, width, height: pixels.length / width };
};

export { makeImage };
