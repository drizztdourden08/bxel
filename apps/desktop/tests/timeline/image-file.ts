/* @layer renderer-app @kind test */
import { encodePngRgba } from '@bxel/formats';

type Paint = (x: number, y: number) => readonly [number, number, number, number];

const NIGHT: readonly [number, number, number, number] = [0x14, 0x0b, 0x26, 255];
const INDIGO: readonly [number, number, number, number] = [0x4b, 0x1f, 0xa0, 255];
const OFF_PALETTE: readonly [number, number, number, number] = [1, 2, 3, 255];
const CLEAR: readonly [number, number, number, number] = [0, 0, 0, 0];

const imageFile = (name: string, width: number, height: number, paint: Paint): File => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) data.set(paint(x, y), (y * width + x) * 4);
  }
  const png = encodePngRgba({ width, height, data });
  if (!png.ok) throw new Error(png.message);
  return new File([new Uint8Array(png.bytes)], name, { type: 'image/png' });
};

export { CLEAR, imageFile, INDIGO, NIGHT, OFF_PALETTE };
