/* @layer renderer-app @kind logic */
import { CHANNELS } from './clip-codec.constants';
import type { Clip } from './selection.type';

const keepClip = (clip: Clip, to: Uint8Array): { clip: Clip; changed: boolean } => {
  const count = to.length / CHANNELS;
  const pixels = Uint8Array.from(clip.pixels, (value) => (value < count ? value : 0));
  return { clip: { ...clip, pixels }, changed: false };
};

export { keepClip };
