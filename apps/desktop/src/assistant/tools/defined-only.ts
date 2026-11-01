/* @layer renderer-app @kind logic */
const definedOnly = <T extends object>(values: T): { [K in keyof T]?: Exclude<T[K], undefined> } =>
  Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)) as { [K in keyof T]?: Exclude<T[K], undefined> };

export { definedOnly };
