/* @layer renderer-app @kind logic */
import { IMPORTED_ANIMATION } from './imported-animation.constants';

const solidRgba = (colour: readonly number[]): Uint8Array =>
  Uint8Array.from(Array.from({ length: IMPORTED_ANIMATION.side ** 2 }, () => colour).flat());

export { solidRgba };
