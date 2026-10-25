/* @layer core @kind config */
import { CRC32_TABLE } from './crc32-table';

const TABLE = Int32Array.from(CRC32_TABLE);
const INITIAL = -1;
const LOW_BYTE = 0xff;
const HEX_DIGITS = 8;

export { HEX_DIGITS, INITIAL, LOW_BYTE, TABLE };
