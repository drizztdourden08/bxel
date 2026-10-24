/* @layer core @kind logic */
import { emitBits } from './emit-bits';
import { GIF_LIMITS } from './gif-limits.constants';
import type { BitWriter, LzwState } from './gif.type';

const growLzwTable = (
  writer: BitWriter,
  state: LzwState,
  key: number,
  minCodeSize: number,
): void => {
  if (state.next < GIF_LIMITS.TABLE_SIZE) {
    const code = state.next;
    state.dict.set(key, code);
    state.next += 1;
    if (code === 1 << state.width && state.width < GIF_LIMITS.MAX_CODE_WIDTH) state.width += 1;
    return;
  }
  emitBits(writer, 1 << minCodeSize, state.width);
  state.dict.clear();
  state.next = (1 << minCodeSize) + 2;
  state.width = minCodeSize + 1;
};

export { growLzwTable };
