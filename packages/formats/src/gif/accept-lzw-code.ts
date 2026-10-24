/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import { GIF_LIMITS } from './gif-limits.constants';
import type { LzwRun, LzwTable } from './gif.type';
import { writeLzwString } from './write-lzw-string';

const addEntry = (table: LzwTable, run: LzwRun, known: boolean, code: number): void => {
  const lead = byteAt(table.first, known ? code : run.prev);
  table.prefix[run.next] = run.prev;
  table.suffix[run.next] = lead;
  table.first[run.next] = byteAt(table.first, run.prev);
  table.length[run.next] = byteAt(table.length, run.prev) + 1;
  run.next += 1;
  if (run.next === 1 << run.width && run.width < GIF_LIMITS.MAX_CODE_WIDTH) run.width += 1;
};

const acceptLzwCode = (table: LzwTable, run: LzwRun, code: number, out: Uint8Array): boolean => {
  const known = code < run.next;
  if (run.prev >= 0) {
    if (!known && code !== run.next) return false;
    if (run.next < GIF_LIMITS.TABLE_SIZE) addEntry(table, run, known, code);
  } else if (!known) {
    return false;
  }
  run.written += writeLzwString(table, code, out, run.written);
  run.prev = code;
  return true;
};

export { acceptLzwCode };
