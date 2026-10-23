/* @layer core @kind logic */
import { HEX_DIGITS, INITIAL, LOW_BYTE, TABLE } from './crc32.constants';

const crc32 = (bytes: Uint8Array): string => {
  let crc = INITIAL;
  for (const byte of bytes) {
    crc = (TABLE[(crc ^ byte) & LOW_BYTE] ?? 0) ^ (crc >>> 8);
  }
  return ((crc ^ INITIAL) >>> 0).toString(16).padStart(HEX_DIGITS, '0');
};

export { crc32 };
