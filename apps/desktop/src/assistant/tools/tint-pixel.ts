/* @layer renderer-app @kind logic */
import { OVERLAY_ALPHA } from './tileset-overlay.constants';

const tintPixel = (data: Uint8ClampedArray, at: number, colour: readonly [number, number, number]): void => {
  for (let channel = 0; channel < 3; channel += 1) {
    data[at + channel] = Math.round((data[at + channel] ?? 0) * (1 - OVERLAY_ALPHA) + (colour[channel] ?? 0) * OVERLAY_ALPHA);
  }
  data[at + 3] = 255;
};

export { tintPixel };
