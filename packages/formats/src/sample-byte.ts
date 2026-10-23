/* @layer core @kind logic */
import { readSample } from './read-sample';

const WIDE_DEPTH = 16;
const BYTE_DEPTH = 8;
const FULL_BYTE = 255;

const toByte = (raw: number, depth: number): number => {
  if (depth === WIDE_DEPTH) return raw >> 8;
  if (depth === BYTE_DEPTH) return raw;
  return raw * (FULL_BYTE / ((1 << depth) - 1));
};

const sampleByte = (data: Uint8Array, rowStart: number, index: number, depth: number): number =>
  toByte(readSample(data, rowStart, index, depth), depth);

export { sampleByte };
