/* @layer renderer-app @kind logic */
import { encodePngRgba } from '@bxel/formats';
import { CHANNELS } from './clip-codec.constants';
import type { Clip } from './selection.type';

const clipPng = (clip: Clip, table: Uint8Array): Uint8Array | null => {
  const data = new Uint8ClampedArray(clip.width * clip.height * CHANNELS);
  clip.pixels.forEach((index, at) => {
    if ((clip.bits[at] ?? 0) === 0 || index === 0) return;
    data.set(table.subarray(index * CHANNELS, (index + 1) * CHANNELS), at * CHANNELS);
  });
  const encoded = encodePngRgba({ width: clip.width, height: clip.height, data });
  return encoded.ok ? encoded.bytes : null;
};

export { clipPng };
