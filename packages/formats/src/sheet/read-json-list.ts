/* @layer core @kind logic */
const readJsonList = <T>(
  value: unknown,
  read: (item: unknown) => T | undefined,
): T[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const out: T[] = [];
  const items: readonly unknown[] = value;
  for (const item of items) {
    const entry = read(item);
    if (entry === undefined) return undefined;
    out.push(entry);
  }
  return out;
};

export { readJsonList };
