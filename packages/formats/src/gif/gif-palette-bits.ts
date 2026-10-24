/* @layer core @kind logic */
const gifPaletteBits = (entries: number): number => {
  let bits = 1;
  while (1 << bits < entries) bits += 1;
  return bits;
};

export { gifPaletteBits };
