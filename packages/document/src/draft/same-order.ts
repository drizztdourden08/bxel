/* @layer core @kind logic */
const sameOrder = <T>(next: readonly T[], items: readonly T[]): boolean => next.every((item, index) => item === items[index]);

export { sameOrder };
