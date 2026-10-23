/* @layer core @kind logic */
const SIGNED_MIDPOINT = 128;
const BYTE_RANGE = 256;

const scoreRow = (bytes: Uint8Array): number => {
  let sum = 0;
  for (const byte of bytes) sum += byte < SIGNED_MIDPOINT ? byte : BYTE_RANGE - byte;
  return sum;
};

export { scoreRow };
