/* @layer core @kind logic */
import { GIF_LIMITS } from './gif-limits.constants';
import type { LzwTable } from './gif.type';

const createLzwTable = (literals: number): LzwTable => {
  const table: LzwTable = {
    prefix: new Uint16Array(GIF_LIMITS.TABLE_SIZE),
    suffix: new Uint8Array(GIF_LIMITS.TABLE_SIZE),
    first: new Uint8Array(GIF_LIMITS.TABLE_SIZE),
    length: new Uint16Array(GIF_LIMITS.TABLE_SIZE),
  };
  for (let i = 0; i < literals; i += 1) {
    table.suffix[i] = i;
    table.first[i] = i;
    table.length[i] = 1;
  }
  return table;
};

export { createLzwTable };
