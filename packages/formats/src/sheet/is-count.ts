/* @layer core @kind logic */
const isCount = (value: number): boolean => Number.isInteger(value) && value >= 0;

export { isCount };
