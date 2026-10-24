/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import { emitBits } from './emit-bits';
import { GIF_LIMITS } from './gif-limits.constants';
import type { BitWriter, LzwState } from './gif.type';
import { growLzwTable } from './grow-lzw-table';

const encodeLzw = (indices: Uint8Array, minCodeSize: number): Uint8Array => {
  const clear = 1 << minCodeSize;
  const writer: BitWriter = { bytes: [], acc: 0, bits: 0 };
  const state: LzwState = { dict: new Map(), next: clear + 2, width: minCodeSize + 1 };
  emitBits(writer, clear, state.width);
  let prefix = byteAt(indices, 0);
  for (let i = 1; i < indices.length; i += 1) {
    const byte = byteAt(indices, i);
    const known = state.dict.get(prefix * 256 + byte);
    if (known === undefined) {
      emitBits(writer, prefix, state.width);
      growLzwTable(writer, state, prefix * 256 + byte, minCodeSize);
      prefix = byte;
    } else {
      prefix = known;
    }
  }
  emitBits(writer, prefix, state.width);
  if (state.next === 1 << state.width && state.width < GIF_LIMITS.MAX_CODE_WIDTH) {
    state.width += 1;
  }
  emitBits(writer, clear + 1, state.width);
  if (writer.bits > 0) writer.bytes.push(writer.acc & 0xff);
  return Uint8Array.from(writer.bytes);
};

export { encodeLzw };
