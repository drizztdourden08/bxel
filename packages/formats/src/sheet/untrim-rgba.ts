/* @layer core @kind logic */
import type { RgbaImage } from '../png.type';
import type { TrimmedImage } from './sheet.type';

const untrimRgba = (trimmed: TrimmedImage): RgbaImage => {
  const { image, offsetX, offsetY, sourceWidth, sourceHeight } = trimmed;
  const data = new Uint8ClampedArray(sourceWidth * sourceHeight * 4);
  for (let row = 0; row < image.height; row += 1) {
    const from = row * image.width * 4;
    const at = ((offsetY + row) * sourceWidth + offsetX) * 4;
    data.set(image.data.subarray(from, from + image.width * 4), at);
  }
  return { data, width: sourceWidth, height: sourceHeight };
};

export { untrimRgba };
