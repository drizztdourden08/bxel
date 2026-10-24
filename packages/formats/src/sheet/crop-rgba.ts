/* @layer core @kind logic */
import type { Box } from '../pixels/box.type';
import type { RgbaImage } from '../png.type';

const cropRgba = (image: RgbaImage, box: Box): RgbaImage => {
  const data = new Uint8ClampedArray(box.width * box.height * 4);
  for (let row = 0; row < box.height; row += 1) {
    const from = ((box.y + row) * image.width + box.x) * 4;
    data.set(image.data.subarray(from, from + box.width * 4), row * box.width * 4);
  }
  return { data, width: box.width, height: box.height };
};

export { cropRgba };
