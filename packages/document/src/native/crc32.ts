/* @layer core @kind logic */
import { CRC32_TABLE } from './crc32-table';

const TABLE = Uint32Array.from(CRC32_TABLE);
const INITIAL = 0xffffffff;
const LOW_BYTE = 0xff;
const HEX_DIGITS = 8;

const crc32 = (bytes: Uint8Array): string => {
  let crc = INITIAL;
  for (const byte of bytes) {
    crc = (TABLE[(crc ^ byte) & LOW_BYTE] ?? 0) ^ (crc >>> 8);
  }
  return ((crc ^ INITIAL) >>> 0).toString(16).padStart(HEX_DIGITS, '0');
};

export { crc32 };
