/* @layer core @kind logic */

const expandLevel = (level: number, bits: number): number =>
  Math.round((level * 255) / (2 ** bits - 1));

export { expandLevel };
