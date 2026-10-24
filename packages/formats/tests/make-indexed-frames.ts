/* @layer tests @kind helper */
import type { IndexedFrame } from '@bxel/formats';

const LCG_MUL = 1103515245;
const LCG_ADD = 12345;

const makeIndexedFrames = (
  count: number,
  size: { readonly width: number; readonly height: number },
  entries: number,
  seed = 1,
): IndexedFrame[] => {
  let state = seed;
  const next = (): number => {
    state = (Math.imul(state, LCG_MUL) + LCG_ADD) >>> 0;
    return state >>> 8;
  };
  const frames: IndexedFrame[] = [];
  for (let f = 0; f < count; f += 1) {
    const indices = new Uint8Array(size.width * size.height);
    for (let i = 0; i < indices.length; i += 1) indices[i] = next() % entries;
    frames.push({ indices, delayMs: 20 + f * 35 });
  }
  return frames;
};

export { makeIndexedFrames };
