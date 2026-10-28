/* @layer core @kind logic */
const allEqual = (value: number, ...others: number[]): boolean => others.every((other) => other === value);

export { allEqual };
