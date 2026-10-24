/* @layer core @kind logic */
const boolOf = (value: unknown, fallback: boolean): boolean => {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1' || value === 'true') return true;
  if (value === 0 || value === '0' || value === 'false') return false;
  return fallback;
};

export { boolOf };
