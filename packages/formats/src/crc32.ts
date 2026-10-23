/* @layer core @kind logic */
import { CRC_TABLE } from './crc-table';

const step = (crc: number, nibble: number): number =>
  (CRC_TABLE[(crc ^ nibble) & 0xf] ?? 0) ^ (crc >>> 4);

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = step(step(crc, byte), byte >>> 4);
  return (crc ^ 0xffffffff) >>> 0;
};

export { crc32 };
