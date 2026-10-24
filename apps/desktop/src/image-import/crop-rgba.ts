/* @layer renderer-app @kind logic */
import { RGBA_BYTES } from './image-import.constants';
import type { SliceRect, SourceImage } from './image-import.type';

const cropRgba = (image: SourceImage, rect: SliceRect): Uint8Array => {
  const out = new Uint8Array(rect.width * rect.height * RGBA_BYTES);
  for (let row = 0; row < rect.height; row += 1) {
    const from = ((rect.y + row) * image.width + rect.x) * RGBA_BYTES;
    out.set(image.data.subarray(from, from + rect.width * RGBA_BYTES), row * rect.width * RGBA_BYTES);
  }
  return out;
};

export { cropRgba };
