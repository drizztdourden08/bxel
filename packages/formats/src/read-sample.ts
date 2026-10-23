/* @layer core @kind logic */
import { PNG_SAMPLE } from './png-sample.constants';

const readSample = (data: Uint8Array, rowStart: number, index: number, depth: number): number => {
  const { BITS_PER_BYTE, WIDE_DEPTH } = PNG_SAMPLE;
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
