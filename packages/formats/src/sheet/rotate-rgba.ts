/* @layer core @kind logic */
import type { RgbaImage } from '../png.type';

const rotateRgba = (image: RgbaImage): RgbaImage => {
  const { width, height } = image;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const from = (y * width + x) * 4;
      const at = (x * height + (height - 1 - y)) * 4;
      data.set(image.data.subarray(from, from + 4), at);
    }
  }
  return { data, width: height, height: width };
};

export { rotateRgba };
