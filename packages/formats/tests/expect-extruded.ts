/* @layer tests @kind helper */
import type { Box, RgbaImage } from '@bxel/formats';
import { expect } from 'vitest';
import { pixelAt } from './pixel-at';

const expectExtruded = (image: RgbaImage, box: Box): void => {
  const right = box.x + box.width;
  const bottom = box.y + box.height;
  expect(pixelAt(image, box.x - 1, box.y)).toEqual(pixelAt(image, box.x, box.y));
  expect(pixelAt(image, box.x - 1, box.y - 1)).toEqual(pixelAt(image, box.x, box.y));
  expect(pixelAt(image, right, bottom)).toEqual(pixelAt(image, right - 1, bottom - 1));
  expect(pixelAt(image, right, box.y - 1)).toEqual(pixelAt(image, right - 1, box.y));
};

export { expectExtruded };
