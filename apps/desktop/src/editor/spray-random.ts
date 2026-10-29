/* @layer renderer-app @kind logic */
const nextRandom = (state: number): { readonly value: number; readonly state: number } => {
  const next = (state + 0x6d2b79f5) >>> 0;
  let mixed = Math.imul(next ^ (next >>> 15), 1 | next);
  mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
  return { value: ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296, state: next };
};

export { nextRandom };
