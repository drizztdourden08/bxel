/* @layer core @kind logic */
const noneEqual = (value: number, ...others: number[]): boolean => others.every((other) => other !== value);

export { noneEqual };
