/* @layer core @kind logic */
import { BLEND } from './blend.constants';
import type { Box } from './box.type';

const clearBox = (canvas: Uint8ClampedArray, canvasWidth: number, box: Box): void => {
  for (let y = box.y; y < box.y + box.height; y += 1) {
    const start = (y * canvasWidth + box.x) * BLEND.CHANNELS;
    canvas.fill(0, start, start + box.width * BLEND.CHANNELS);
  }
};

export { clearBox };
