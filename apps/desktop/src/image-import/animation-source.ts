/* @layer renderer-app @kind logic */
import type { AnimationDecodeResult } from '@bxel/formats';
import { frameDelay } from './frame-delay';
import type { DecodedSource } from './image-import.type';

const animationSource = (decoded: AnimationDecodeResult): DecodedSource | null => {
  if (!decoded.ok) return null;
  const frames = decoded.frames.map((frame) => ({ data: frame.data, delayMs: frameDelay(frame.delayMs) }));
  const first = frames[0];
  if (!first) return null;
  const { width, height } = decoded;
  return { width, height, data: first.data, ...(frames.length > 1 ? { frames } : {}) };
};

export { animationSource };
