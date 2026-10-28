/* @layer core @kind logic */
const COLOURS = 256;

/** Counts the indexes that `after` holds and `before` does not. A resampler that keeps the palette closed returns 0. */
const coloursAdded = (before: Uint8Array, after: Uint8Array): number => {
  const known = new Uint8Array(COLOURS);
  for (const value of before) known[value] = 1;
  const seen = new Uint8Array(COLOURS);
  let added = 0;
  for (const value of after) {
    if (known[value] === 0 && seen[value] === 0) {
      seen[value] = 1;
      added++;
    }
  }
  return added;
};

export { coloursAdded };
