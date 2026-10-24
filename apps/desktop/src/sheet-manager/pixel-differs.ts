/* @layer renderer-app @kind logic */
const pixelDiffers = (a: Uint8ClampedArray, b: Uint8ClampedArray, at: number): boolean => {
  if (a[at + 3] === 0 && b[at + 3] === 0) return false;
  return a[at] !== b[at] || a[at + 1] !== b[at + 1] || a[at + 2] !== b[at + 2] || a[at + 3] !== b[at + 3];
};

export { pixelDiffers };
