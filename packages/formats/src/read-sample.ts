/* @layer core @kind logic */
const BITS_PER_BYTE = 8;
const WIDE_DEPTH = 16;

const readSample = (data: Uint8Array, rowStart: number, index: number, depth: number): number => {
  if (depth === WIDE_DEPTH) {
    const at = rowStart + index * 2;
    return ((data[at] ?? 0) << BITS_PER_BYTE) | (data[at + 1] ?? 0);
  }
  if (depth === BITS_PER_BYTE) return data[rowStart + index] ?? 0;
  const bit = index * depth;
  const byte = data[rowStart + (bit >> 3)] ?? 0;
  return (byte >> (BITS_PER_BYTE - depth - (bit & 7))) & ((1 << depth) - 1);
};

export { readSample };
