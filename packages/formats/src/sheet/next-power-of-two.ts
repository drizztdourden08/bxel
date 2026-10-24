/* @layer core @kind logic */
const nextPowerOfTwo = (value: number): number => 2 ** Math.ceil(Math.log2(Math.max(value, 1)));

export { nextPowerOfTwo };
