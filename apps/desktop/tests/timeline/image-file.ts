/* @layer renderer-app @kind test */
import { encodePngRgba } from '@bxel/formats';
import { paintedData } from './painted-data';
import type { Paint } from './painted-data.type';

const NIGHT: readonly [number, number, number, number] = [0x14, 0x0b, 0x26, 255];
const INDIGO: readonly [number, number, number, number] = [0x4b, 0x1f, 0xa0, 255];
const OFF_PALETTE: readonly [number, number, number, number] = [1, 2, 3, 255];
const CLEAR: readonly [number, number, number, number] = [0, 0, 0, 0];

const imageFile = (name: string, width: number, height: number, paint: Paint): File => {
  const data = paintedData(width, height, paint);
  const png = encodePngRgba({ width, height, data });
  if (!png.ok) throw new Error(png.message);
  return new File([new Uint8Array(png.bytes)], name, { type: 'image/png' });
};

export { CLEAR, imageFile, INDIGO, NIGHT, OFF_PALETTE };
