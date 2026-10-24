/* @layer core @kind logic */
import type { RgbaImage } from '../png.type';
import type { SheetPlacement } from './sheet.type';

const clamp = (value: number, max: number): number => Math.min(Math.max(value, 0), max);

const drawExtruded = (sheet: RgbaImage, placement: SheetPlacement, extrude: number): void => {
  const { box, image } = placement;
  for (let fy = -extrude; fy < box.height + extrude; fy += 1) {
    for (let fx = -extrude; fx < box.width + extrude; fx += 1) {
      const from = (clamp(fy, box.height - 1) * image.width + clamp(fx, box.width - 1)) * 4;
      const at = ((box.y + fy) * sheet.width + box.x + fx) * 4;
      sheet.data.set(image.data.subarray(from, from + 4), at);
    }
  }
};

export { drawExtruded };
