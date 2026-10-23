/* @layer tests @kind logic */
const brand = <T extends string>(value: string): T => value as T;

export { brand };
