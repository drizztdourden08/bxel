/* @layer core @kind logic */
import { HEX_DIGITS, INITIAL, LOW_BYTE, TABLE } from './crc32.constants';

const crc32 = (bytes: Uint8Array): string => {
  const table = TABLE;
  const mask = LOW_BYTE;
  let crc = INITIAL;
  let at = 0;
  const end = bytes.length;
  while (at < end) {
    crc = (table[(crc ^ (bytes[at] ?? 0)) & mask] ?? 0) ^ (crc >>> 8);
    at += 1;
  }
  return ((crc ^ INITIAL) >>> 0).toString(16).padStart(HEX_DIGITS, '0');
};

export { crc32 };
