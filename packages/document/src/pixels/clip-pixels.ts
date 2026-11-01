/* @layer core @kind logic */
const clipPixels = (pixels: Uint8Array, base: Uint8Array | undefined): Uint8Array => {
  const out = new Uint8Array(pixels.length);
  if (!base) return out;
  for (let at = 0; at < pixels.length; at += 1) {
    if ((base[at] ?? 0) !== 0) out[at] = pixels[at] ?? 0;
  }
  return out;
};

export { clipPixels };
