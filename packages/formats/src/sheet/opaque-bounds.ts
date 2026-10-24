/* @layer core @kind logic */
import type { Box } from '../pixels/box.type';
import type { RgbaImage } from '../png.type';

const opaqueBounds = (image: RgbaImage): Box | undefined => {
  let left = image.width;
  let top = image.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if ((image.data[(y * image.width + x) * 4 + 3] ?? 0) === 0) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = y;
    }
  }
  if (right < 0) return undefined;
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
};

export { opaqueBounds };
