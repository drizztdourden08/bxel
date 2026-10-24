/* @layer renderer-app @kind logic */
import { RGBA_BYTES } from './image-import.constants';

const differs = (before: Uint8ClampedArray, after: Uint8ClampedArray, at: number): boolean => {
  const alpha = before[at + 3] ?? 0;
  const next = after[at + 3] ?? 0;
  if (alpha === 0 && next === 0) return false;
  if (alpha !== next) return true;
  return before[at] !== after[at] || before[at + 1] !== after[at + 1] || before[at + 2] !== after[at + 2];
};

const countChanged = (before: Uint8ClampedArray, after: Uint8ClampedArray): number => {
  let changed = 0;
  for (let at = 0; at + RGBA_BYTES <= before.length; at += RGBA_BYTES) {
    if (differs(before, after, at)) changed += 1;
  }
  return changed;
};

export { countChanged };
