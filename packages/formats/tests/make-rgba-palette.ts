/* @layer tests @kind helper */
const makeRgbaPalette = (entries: number, firstAlpha = 255): Uint8Array => {
  const palette = new Uint8Array(entries * 4);
  for (let i = 0; i < entries; i += 1) {
    palette.set([(i * 37) & 255, (255 - i * 11) & 255, (i * 91 + 5) & 255, i === 0 ? firstAlpha : 255], i * 4);
  }
  return palette;
};

export { makeRgbaPalette };
