/* @layer core @kind logic */
import type { DiffPair } from './diff-pair.type';
import { ALIGN_MASK, ALIGN_UP, WORD_BYTES, WORD_SHIFT } from './word.constants';


const lastDiffIn = (pair: DiffPair, start: number, end: number): number => {
  const { before, after, beforeWords, afterWords } = pair;
  let at = end;
  const aligned = Math.max(start, end & ALIGN_MASK);
  while (at > aligned) {
    at -= 1;
    if (before[at] !== after[at]) return at;
  }
  if (beforeWords && afterWords) {
    const floor = (start + ALIGN_UP) & ALIGN_MASK;
    while (
      at >= floor + WORD_BYTES &&
      at % WORD_BYTES === 0 &&
      beforeWords[(at >> WORD_SHIFT) - 1] === afterWords[(at >> WORD_SHIFT) - 1]
    ) {
      at -= WORD_BYTES;
    }
  }
  while (at > start) {
    at -= 1;
    if (before[at] !== after[at]) return at;
  }
  return -1;
};

export { lastDiffIn };
