/* @layer core @kind constants */
import type { SheetTagDirection } from './sheet-metadata.type';

const ASEPRITE_DIRECTION: Readonly<Record<SheetTagDirection, string>> = {
  forward: 'forward',
  reverse: 'reverse',
  pingpong: 'pingpong',
  pingpongReverse: 'pingpong_reverse',
};

export { ASEPRITE_DIRECTION };
