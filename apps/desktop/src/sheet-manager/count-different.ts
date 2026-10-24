/* @layer renderer-app @kind logic */
import { CHANNELS } from '../sheet/sheet.constants';
import { pixelDiffers } from './pixel-differs';

const countDifferent = (a: Uint8ClampedArray, b: Uint8ClampedArray): number => {
  let count = 0;
  for (let at = 0; at < a.length; at += CHANNELS) {
    if (pixelDiffers(a, b, at)) count += 1;
  }
  return count;
};

export { countDifferent };
