/* @layer core @kind logic */

const isPositiveInteger = (value: number): boolean => Number.isInteger(value) && value > 0;

export { isPositiveInteger };
