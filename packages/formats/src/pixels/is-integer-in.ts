/* @layer core @kind logic */
const isIntegerIn = (value: number, min: number, max: number): boolean =>
  Number.isInteger(value) && value >= min && value <= max;

export { isIntegerIn };
