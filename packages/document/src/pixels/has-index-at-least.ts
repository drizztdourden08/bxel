/* @layer core @kind logic */
import { BYTE_ONES, HIGH_BITS, HIGH_BYTE, SAFE_LIMIT } from './has-index-at-least.constants';
import { WORD_BYTES } from './word.constants';
import { wordsOf } from './words-of';

const tailHas = (pixels: Uint8Array, from: number, limit: number): boolean => {
  for (let at = from; at < pixels.length; at += 1) {
    if ((pixels[at] ?? 0) >= limit) return true;
  }
  return false;
};

const wordsHave = (words: Uint32Array, limit: number): boolean => {
  const bias = Math.imul(HIGH_BYTE - (limit - 1), BYTE_ONES) >>> 0;
  const pairs = words.length - (words.length % 2);
  for (let at = 0; at < pairs; at += 2) {
    const first = words[at] ?? 0;
    const second = words[at + 1] ?? 0;
    if (((((first + bias) | first) | ((second + bias) | second)) & HIGH_BITS) !== 0) return true;
  }
  const last = words[pairs] ?? 0;
  return pairs < words.length && (((last + bias) | last) & HIGH_BITS) !== 0;
};

const hasIndexAtLeast = (pixels: Uint8Array, limit: number): boolean => {
  if (limit <= 0) return true;
  const words = limit <= SAFE_LIMIT ? wordsOf(pixels) : null;
  if (!words) return tailHas(pixels, 0, limit);
  return wordsHave(words, limit) || tailHas(pixels, words.length * WORD_BYTES, limit);
};

export { hasIndexAtLeast };
