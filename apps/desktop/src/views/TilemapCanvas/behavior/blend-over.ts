/* @layer renderer-app @kind logic */
import { CHANNELS } from '../../../sheet/sheet.constants';

const OPAQUE = 255;

const blendOver = (target: Uint8ClampedArray, source: Uint8ClampedArray, strength: number): void => {
  for (let at = 0; at < source.length; at += CHANNELS) {
    const top = ((source[at + 3] ?? 0) / OPAQUE) * strength;
    if (top <= 0) continue;
    const under = ((target[at + 3] ?? 0) / OPAQUE) * (1 - top);
    const total = top + under;
    for (let channel = 0; channel < 3; channel += 1) {
      target[at + channel] = ((source[at + channel] ?? 0) * top + (target[at + channel] ?? 0) * under) / total;
    }
    target[at + 3] = total * OPAQUE;
  }
};

export { blendOver };
