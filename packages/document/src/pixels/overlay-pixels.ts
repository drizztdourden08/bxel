/* @layer core @kind logic */
const overlayPixels = (target: Uint8Array, source: Uint8Array): void => {
  for (const [index, value] of source.entries()) {
    if (value !== 0) target[index] = value;
  }
};

export { overlayPixels };
