/* @layer renderer-app @kind logic */
import { composeAnimationFrame } from '@bxel/document';
import type { AnimStep, Animation, Artwork } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import { composedRgba } from '../../timeline/composed-rgba';
import type { AnimationStrip } from './tool-input.type';

const CHANNELS = 4;

const animationStrip = (artwork: Artwork, animation: Animation, steps: readonly AnimStep[]): AnimationStrip | null => {
  const width = animation.width * steps.length;
  const data = new Uint8ClampedArray(width * animation.height * CHANNELS);
  const hashed: Uint8Array[] = [];
  for (const [at, step] of steps.entries()) {
    const rgba = composedRgba(artwork, animation, step.frameId, step.flip);
    if (!rgba) return null;
    for (let row = 0; row < animation.height; row += 1) {
      const from = row * animation.width * CHANNELS;
      data.set(rgba.subarray(from, from + animation.width * CHANNELS), (row * width + at * animation.width) * CHANNELS);
    }
    hashed.push(composeAnimationFrame(artwork, animation, step.frameId, step.flip));
  }
  const image: RgbaImage = { data, width, height: animation.height };
  const indices = new Uint8Array(hashed.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of hashed) {
    indices.set(part, offset);
    offset += part.length;
  }
  return { image, indices };
};

export { animationStrip };
