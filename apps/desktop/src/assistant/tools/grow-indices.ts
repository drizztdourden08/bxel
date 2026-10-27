/* @layer renderer-app @kind logic */
const growIndices = (indices: Uint8Array, width: number, height: number, scale: number): Uint8Array => {
  if (scale === 1) return indices;
  const out = new Uint8Array(width * scale * height * scale);
  for (let y = 0; y < height * scale; y += 1) {
    for (let x = 0; x < width * scale; x += 1) out[y * width * scale + x] = indices[Math.floor(y / scale) * width + Math.floor(x / scale)] ?? 0;
  }
  return out;
};

export { growIndices };
