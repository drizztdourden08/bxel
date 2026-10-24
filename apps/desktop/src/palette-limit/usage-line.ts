/* @layer renderer-app @kind logic */
import { LIMIT_TEXT } from './palette-limit.constants';

const usageLine = (used: number, opaque: number): string =>
  opaque > 0 && used >= opaque ? LIMIT_TEXT.full(opaque) : LIMIT_TEXT.used(used, opaque);

export { usageLine };
