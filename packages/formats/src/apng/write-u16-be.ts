/* @layer core @kind logic */
const writeU16Be = (target: Uint8Array, offset: number, value: number): void => {
  target[offset] = (value >>> 8) & 0xff;
  target[offset + 1] = value & 0xff;
};

export { writeU16Be };
