/* @layer renderer-app @kind logic */
import { BLEND_CHANNELS, BLEND_OPAQUE } from './blend-ghost.constants';

const blendGhost = (canvas: Uint8ClampedArray, ghost: Uint8ClampedArray, alpha: number): void => {
  for (let at = 0; at < canvas.length; at += BLEND_CHANNELS) {
    const above = ((ghost[at + 3] ?? 0) / BLEND_OPAQUE) * alpha;
    if (above === 0) continue;
    const below = (canvas[at + 3] ?? 0) / BLEND_OPAQUE;
    const out = above + below * (1 - above);
    for (let channel = 0; channel < 3; channel += 1) {
      canvas[at + channel] = ((ghost[at + channel] ?? 0) * above + (canvas[at + channel] ?? 0) * below * (1 - above)) / out;
    }
    canvas[at + 3] = out * BLEND_OPAQUE;
  }
};

export { blendGhost };
