/* @layer core @kind logic */
import { acceptLzwCode } from './accept-lzw-code';
import { createLzwTable } from './create-lzw-table';
import type { LzwReader, LzwRun } from './gif.type';
import { readLzwCode } from './read-lzw-code';

const decodeLzw = (
  data: Uint8Array,
  minCodeSize: number,
  pixelCount: number,
): Uint8Array | undefined => {
  const clear = 1 << minCodeSize;
  const table = createLzwTable(clear);
  const reader: LzwReader = { data, pos: 0, acc: 0, bits: 0 };
  const run: LzwRun = { next: clear + 2, width: minCodeSize + 1, prev: -1, written: 0 };
  const out = new Uint8Array(pixelCount);
  while (run.written < pixelCount) {
    const code = readLzwCode(reader, run.width);
    if (code < 0 || code === clear + 1) return undefined;
    if (code === clear) {
      run.next = clear + 2;
      run.width = minCodeSize + 1;
      run.prev = -1;
    } else if (!acceptLzwCode(table, run, code, out)) {
      return undefined;
    }
  }
  return out;
};

export { decodeLzw };
