/* @layer renderer-app @kind logic */
import { decodePng } from '@bxel/formats';
import { ALPHA_CUTOFF, CHANNELS } from './clip-codec.constants';
import { nearestIndex } from './nearest-index';
import type { SystemClip } from './system-clip.type';

const clipFromPng = (png: Uint8Array, table: Uint8Array): SystemClip | null => {
  const decoded = decodePng(png);
  if (!decoded.ok) return null;
  const cells = decoded.width * decoded.height;
  const pixels = new Uint8Array(cells);
  const bits = new Uint8Array(cells);
  let changed = false;
  for (let at = 0; at < cells; at++) {
    const rgb = Array.from(decoded.data.subarray(at * CHANNELS, at * CHANNELS + CHANNELS));
    if ((rgb[3] ?? 0) < ALPHA_CUTOFF) continue;
    const index = nearestIndex(table, [rgb[0] ?? 0, rgb[1] ?? 0, rgb[2] ?? 0]);
    pixels[at] = index;
    bits[at] = 1;
    changed ||= [0, 1, 2].some((channel) => table[index * CHANNELS + channel] !== rgb[channel]);
  }
  return { clip: { width: decoded.width, height: decoded.height, origin: { x: 0, y: 0 }, pixels, bits }, changed };
};

export { clipFromPng };
