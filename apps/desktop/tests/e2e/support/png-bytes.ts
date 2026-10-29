/* @layer renderer-app @kind logic */
import { encodePngRgba } from '@bxel/formats';

const pngBytes = (width: number, height: number, rgba: readonly number[]): Uint8Array => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let at = 0; at < width * height; at += 1) data.set(rgba, at * 4);
  const png = encodePngRgba({ width, height, data });
  if (!png.ok) throw new Error(png.message);
  return png.bytes;
};

export { pngBytes };
