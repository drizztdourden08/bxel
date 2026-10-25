/* @layer core @kind logic */
import { WORD_BYTES } from './word.constants';

const wordsOf = (bytes: Uint8Array): Uint32Array | null =>
  bytes.byteOffset % WORD_BYTES === 0 ? new Uint32Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.length / WORD_BYTES)) : null;

export { wordsOf };
