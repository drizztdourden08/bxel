/* @layer renderer-app @kind logic */
import { CHANNELS } from './clip-codec.constants';
import { nearestIndex } from './nearest-index';
import type { Clip } from './selection.type';

const sameTable = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((value, at) => value === b[at]);

const remapClip = (clip: Clip, from: Uint8Array, to: Uint8Array): { clip: Clip; changed: boolean } => {
  if (from.length === 0 || sameTable(from, to)) return { clip, changed: false };
  const lookup = Uint8Array.from({ length: from.length / CHANNELS }, (_, at) => {
    if (at === 0) return 0;
    return nearestIndex(to, [from[at * CHANNELS] ?? 0, from[at * CHANNELS + 1] ?? 0, from[at * CHANNELS + 2] ?? 0]);
  });
  const pixels = Uint8Array.from(clip.pixels, (value) => lookup[value] ?? 0);
  return { clip: { ...clip, pixels }, changed: true };
};

export { remapClip };
