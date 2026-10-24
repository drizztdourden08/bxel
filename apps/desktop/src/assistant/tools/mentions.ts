/* @layer renderer-app @kind logic */
const mentions = (value: unknown, names: ReadonlySet<string>): boolean => {
  if (typeof value === 'string') return names.has(value);
  if (ArrayBuffer.isView(value)) return false;
  if (Array.isArray(value)) return value.some((item) => mentions(item, names));
  if (typeof value === 'object' && value !== null) return Object.values(value).some((item) => mentions(item, names));
  return false;
};

export { mentions };
