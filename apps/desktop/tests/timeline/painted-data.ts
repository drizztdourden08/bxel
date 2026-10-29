/* @layer renderer-app @kind test */
import type { Paint } from './painted-data.type';

const paintedData = (width: number, height: number, paint: Paint): Uint8ClampedArray => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) data.set(paint(x, y), (y * width + x) * 4);
  }
  return data;
};

export { paintedData };
