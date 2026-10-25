/* @layer core @kind logic */
import type { DiffPair } from './diff-pair.type';
import { ALIGN_MASK, ALIGN_UP, WORD_SHIFT } from './word.constants';


const firstDiffIn = (pair: DiffPair, start: number, end: number): number => {
  const { before, after, beforeWords, afterWords } = pair;
  let at = start;
  const aligned = Math.min(end, (start + ALIGN_UP) & ALIGN_MASK);
  for (; at < aligned; at += 1) {
    if (before[at] !== after[at]) return at;
  }
  if (beforeWords && afterWords) {
    let word = at >> WORD_SHIFT;
    const wordEnd = end >> WORD_SHIFT;
    while (word < wordEnd && beforeWords[word] === afterWords[word]) word += 1;
    at = Math.max(at, word << WORD_SHIFT);
  }
  for (; at < end; at += 1) {
    if (before[at] !== after[at]) return at;
  }
  return -1;
};

export { firstDiffIn };
