/* @layer core @kind logic */
const isSize = (value: number): boolean => Number.isInteger(value) && value >= 1;

export { isSize };
