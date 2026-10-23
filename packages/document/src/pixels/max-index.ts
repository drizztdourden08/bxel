/* @layer core @kind logic */
const maxIndex = (pixels: Uint8Array): number => {
  let max = 0;
  for (const value of pixels) {
    if (value > max) max = value;
  }
  return max;
};

export { maxIndex };
