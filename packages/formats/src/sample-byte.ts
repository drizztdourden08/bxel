/* @layer core @kind logic */
import { PNG_SAMPLE } from './png-sample.constants';
import { readSample } from './read-sample';

const toByte = (raw: number, depth: number): number => {
  if (depth === PNG_SAMPLE.WIDE_DEPTH) return raw >> 8;
  if (depth === PNG_SAMPLE.BITS_PER_BYTE) return raw;
  return raw * (PNG_SAMPLE.FULL_BYTE / ((1 << depth) - 1));
};

const sampleByte = (data: Uint8Array, rowStart: number, index: number, depth: number): number =>
  toByte(readSample(data, rowStart, index, depth), depth);

export { sampleByte };
