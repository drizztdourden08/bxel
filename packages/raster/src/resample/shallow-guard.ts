/* @layer core @kind logic */
const shallowGuard = (open: boolean, x: number, avoid: readonly number[]): boolean => open && avoid.every((value) => value !== x);

export { shallowGuard };
