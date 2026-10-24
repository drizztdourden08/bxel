/* @layer core @kind logic */
import type { DiffPair } from './diff-pair.type';
import { wordsOf } from './words-of';

const diffPair = (before: Uint8Array, after: Uint8Array): DiffPair => ({
  before,
  after,
  beforeWords: wordsOf(before),
  afterWords: wordsOf(after),
});

export { diffPair };
