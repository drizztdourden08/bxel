/* @layer core @kind logic */
const writeU16Le = (target: Uint8Array, offset: number, value: number): void => {
  target[offset] = value & 0xff;
  target[offset + 1] = (value >>> 8) & 0xff;
};

export { writeU16Le };
