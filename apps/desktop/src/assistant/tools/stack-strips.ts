/* @layer renderer-app @kind logic */
import { CHANNELS } from './animation-strip.constants';
import type { AnimationStrip } from './tool-input.type';

const stackStrips = (strips: readonly AnimationStrip[], frameHeight: number): AnimationStrip => {
  const width = Math.max(1, ...strips.map((strip) => strip.image.width));
  const data = new Uint8ClampedArray(width * frameHeight * strips.length * CHANNELS);
  for (const [at, strip] of strips.entries()) {
    for (let row = 0; row < frameHeight; row += 1) {
      const from = row * strip.image.width * CHANNELS;
      data.set(strip.image.data.subarray(from, from + strip.image.width * CHANNELS), ((at * frameHeight + row) * width) * CHANNELS);
    }
  }
  const hashed = new Uint8Array(strips.reduce((total, strip) => total + strip.indices.length, 0));
  let offset = 0;
  for (const strip of strips) {
    hashed.set(strip.indices, offset);
    offset += strip.indices.length;
  }
  return { image: { data, width, height: frameHeight * strips.length }, indices: hashed };
};

export { stackStrips };
