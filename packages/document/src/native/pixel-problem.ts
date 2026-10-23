/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import type { PaletteBank } from '../model/palette.type';
import { maxIndex } from '../pixels/max-index';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const pixelProblem = (bytes: Uint8Array, size: Size, bank: PaletteBank, path: string): LoadIssue | null => {
  const expected = size.width * size.height;
  if (bytes.length !== expected) {
    return makeIssue(LOAD_ERROR.INDEX_OUT_OF_RANGE, `${path} has ${bytes.length} bytes, expected ${expected}.`, path);
  }
  const highest = maxIndex(bytes);
  if (highest < bank.slots.length) return null;
  return makeIssue(LOAD_ERROR.INDEX_OUT_OF_RANGE, `${path} uses index ${highest}; the bank has ${bank.slots.length} slots.`, path);
};

export { pixelProblem };
