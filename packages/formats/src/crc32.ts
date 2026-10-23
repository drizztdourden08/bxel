/* @layer core @kind logic */
const CRC_POLYNOMIAL = 0xedb88320;
const TABLE_SIZE = 256;

const buildTable = (): Uint32Array => {
  const table = new Uint32Array(TABLE_SIZE);
  for (let n = 0; n < TABLE_SIZE; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? CRC_POLYNOMIAL ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
};

const TABLE = buildTable();

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (TABLE[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

export { crc32 };
