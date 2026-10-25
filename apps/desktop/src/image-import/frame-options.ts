/* @layer renderer-app @kind logic */
import { frameDelay } from './frame-delay';
import type { FrameOptions, SourceImage } from './image-import.type';

const frameOptions = (image: SourceImage): FrameOptions => {
  const [first, ...later] = image.frames ?? [];
  if (!first) return {};
  return {
    durationMs: frameDelay(first.delayMs),
    frames: later.map((frame) => ({ rgba: Uint8Array.from(frame.data), durationMs: frameDelay(frame.delayMs) })),
  };
};

export { frameOptions };
