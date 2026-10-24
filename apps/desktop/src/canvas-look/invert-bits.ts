/* @layer renderer-app @kind logic */
import { cleanBits } from './clean-bits';

const invertBits = (bits: string): string => cleanBits(bits).replace(/[01]/g, (bit) => (bit === '1' ? '0' : '1'));

export { invertBits };
