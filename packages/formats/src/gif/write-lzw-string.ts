/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import type { LzwTable } from './gif.type';

const writeLzwString = (table: LzwTable, code: number, out: Uint8Array, at: number): number => {
  const length = byteAt(table.length, code);
  let current = code;
  for (let i = length - 1; i >= 0; i -= 1) {
    if (at + i < out.length) out[at + i] = byteAt(table.suffix, current);
    current = byteAt(table.prefix, current);
  }
  return length;
};

export { writeLzwString };
